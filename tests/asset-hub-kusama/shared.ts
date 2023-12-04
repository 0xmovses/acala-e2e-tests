import { beforeEach, describe, it } from 'vitest'
import { sendTransaction } from '@acala-network/chopsticks-testing'
import _ from 'lodash'

import { Network, NetworkNames, createContext, createNetworks } from '../../networks'
import { check, checkEvents, checkHrmp, checkSystemEvents, checkUmp } from '../../helpers'

import type { TestType as AssetHubKusamaTestType } from './dmp.test'

type TestType = AssetHubKusamaTestType
export default function buildTest(tests: ReadonlyArray<TestType>) {
  for (const { from, to, test, name, ...opt } of tests) {
    describe(`'${from}' -> '${to}' xcm transfer '${name}'`, async () => {
      let fromChain: Network
      let toChain: Network
      let routeChain: Network

      const ctx = createContext()
      const { alice } = ctx

      let fromAccount = alice
      if ('fromAccount' in opt) {
        fromAccount = opt.fromAccount(ctx)
      }

      let toAccount = alice
      if ('toAccount' in opt) {
        toAccount = opt.toAccount(ctx)
      }

      let precision = 3
      if ('precision' in opt) {
        precision = opt.precision
      }

      beforeEach(async () => {
        const networkOptions = {
          [from]: undefined,
          [to]: undefined,
        } as Record<NetworkNames, undefined>
        if ('route' in opt) {
          networkOptions[opt.route] = undefined
        }
        const chains = await createNetworks(networkOptions, ctx)

        fromChain = chains[from]
        toChain = chains[to]
        if ('route' in opt) {
          routeChain = chains[opt.route]
        }

        if ('fromStorage' in opt) {
          const override = typeof opt.fromStorage === 'function' ? opt.fromStorage(ctx) : opt.fromStorage
          await fromChain.dev.setStorage(override)
        }

        if ('toStorage' in opt) {
          const override = typeof opt.toStorage === 'function' ? opt.toStorage(ctx) : opt.toStorage
          await toChain.dev.setStorage(override)
        }

        return async () => {
          await toChain.teardown()
          await fromChain.teardown()
          if (routeChain) {
            await routeChain.teardown()
          }
        }
      })

      if ('xcmPalletDown' in test) {
        const { balance, tx } = test.xcmPalletDown

        it('xcmPallet transfer', async () => {
          const tx0 = await sendTransaction(tx(fromChain, toAccount.addressRaw).signAsync(fromAccount))

          await fromChain.chain.newBlock()

          await check(fromChain.api.query.system.account(fromAccount.address))
            .redact({ number: precision })
            .toMatchSnapshot('balance on from chain')
          await checkEvents(tx0, 'xcmPallet').redact({ number: precision }).toMatchSnapshot('tx events')

          await toChain.chain.newBlock()

          await check(balance(toChain, toAccount.address))
            .redact({ number: precision })
            .toMatchSnapshot('balance on to chain')
          await checkSystemEvents(toChain, 'parachainSystem', 'dmpQueue').toMatchSnapshot('to chain dmp events')
        })
      }
    })
  }
}
