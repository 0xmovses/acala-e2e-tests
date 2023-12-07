import { beforeEach, describe, it } from 'vitest'
import { sendTransaction } from '@acala-network/chopsticks-testing'
import _ from 'lodash'

import { Network, NetworkNames, createContext, createNetworks } from '../../networks'
import { check, checkEvents, checkHrmp, checkSystemEvents, checkUmp } from '../../helpers'

import type { TestType } from './xcm.test'

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
        fromAccount = (opt.fromAccount as any)(ctx)
      }
      console.log('aliceAddress', alice.address)


      let toAccount = alice
      if ('toAccount' in opt) {
        toAccount = (opt.toAccount as any)(ctx)
      }

      const precision = 3

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

        return async () => {
          await toChain.teardown()
          await fromChain.teardown()
          if (routeChain) {
            await routeChain.teardown()
          }
        }
      })

      if ('xcmPalletDown' in test) {
        const { systemBalance, tx } = test.xcmPalletDown

        it('xcmPallet transfer', async () => {
          const tx0 = await sendTransaction(tx(fromChain, toAccount.addressRaw).signAsync(fromAccount))

          await fromChain.chain.newBlock()

          await check(fromChain.api.query.system.account(fromAccount.address))
            .redact({ number: precision })
            .toMatchSnapshot('balance on fromChain')
          await checkEvents(tx0, 'xcmPallet').redact({ number: precision }).toMatchSnapshot('tx events')

          await toChain.chain.newBlock()

          await check(systemBalance(toChain, toAccount.address))
            .toMatchSnapshot('balance on toChain')
        })
      }

      if ('xcmPalletUp' in test) {
        const { systemBalance, tokensBalance, tx } = test.xcmPalletUp

        it('xcmPallet transfer', async () => {
          const tx0 = await sendTransaction(tx(fromChain, fromAccount.addressRaw).signAsync(fromAccount))
          console.log('tx0', tx0)

          await toChain.chain.newBlock()

          await check(tokensBalance(toChain, fromAccount.address))
            .redact({ number: precision })
            .toMatchSnapshot('balance on fromChain')
          await checkUmp(fromChain).toMatchSnapshot('from chain ump messages')

          await toChain.chain.newBlock()

          await check(systemBalance(fromChain, fromAccount.address))
            .redact({ number: precision })
            .toMatchSnapshot('balance on toChain')

          await checkSystemEvents(toChain, 'ump', 'messageQueue').toMatchSnapshot('to chain ump events')

        })
      }
    })
  }
}
