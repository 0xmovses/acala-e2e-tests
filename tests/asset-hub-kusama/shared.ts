import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Network, NetworkNames, createNetworks } from '../../networks';
import { beforeEach, describe, expect, it } from 'vitest'
import { check, sendTransaction, testingPairs } from '@acala-network/chopsticks-testing'

export type TestType = {
  from: NetworkNames
  to: NetworkNames
  token: string
  ignoreFee?: boolean
}

// make configurable / more generalised
export const buildTests = (tests: ReadonlyArray<TestType>) => {
  for (const {from, to, token, ignoreFee } of tests) {
    describe(`'${from}' to '${to}' dmp asset-hub-kusama'${token}'`, async () => {
      let fromChain: Network
      let toChain: Network

      const { alice } = testingPairs()

      describe('xcm limitedTeleportAssets', async () => {
        const { [from]: fromChain1, [to]: toChain1 } = await createNetworks({
          [from]: undefined,
          [to]: undefined,
        })

          if(from == 'kusama-') {
            await fromChain1.dev.setStorage({
              Tokens: {
                Accounts: [
                  [[alice.address, { Token: 'KSM' }], { free: '1000000000000000' }],
                  [[alice.address, { Token: 'DOT' }], { free: 10 * 1e12 }],
                ],
              },
            })
          }
        })
    })
  }
}