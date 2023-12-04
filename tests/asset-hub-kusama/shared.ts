import { Keyring } from '@polkadot/keyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { Network, NetworkNames, createNetworks } from '../../networks';
import { beforeEach, describe, expect, it } from 'vitest'
import { check, sendTransaction, testingPairs } from '@acala-network/chopsticks-testing'
import { ApiPromise } from '@polkadot/api'
import { AcalaAdapter, KaruraAdapter } from '@polkawallet/bridge/adapters/acala'
import { KusamaAdapter, PolkadotAdapter } from '@polkawallet/bridge/adapters/polkadot'
import { MoonbeamAdapter, MoonriverAdapter } from '@polkawallet/bridge/adapters/moonbeam'
import { StatemineAdapter, StatemintAdapter } from '@polkawallet/bridge/adapters/statemint'
import { BasiliskAdapter } from '@polkawallet/bridge/adapters/hydradx'
import { BifrostAdapter } from '@polkawallet/bridge/adapters/bifrost'
import { AltairAdapter } from '@polkawallet/bridge/adapters/centrifuge'
import { HeikoAdapter, ParallelAdapter } from '@polkawallet/bridge/adapters/parallel'
import { AstarAdapter, ShidenAdapter } from '@polkawallet/bridge/adapters/astar'
import { ShadowAdapter } from '@polkawallet/bridge/adapters/crust'
import { QuartzAdapter, UniqueAdapter } from '@polkawallet/bridge/adapters/unique'
import { InterlayAdapter, KintsugiAdapter } from '@polkawallet/bridge/adapters/interlay'
import { KhalaAdapter } from '@polkawallet/bridge/adapters/phala'
import { CrabAdapter } from '@polkawallet/bridge/adapters/darwinia'
import { Bridge } from '@polkawallet/bridge'
import { FixedPointNumber } from '@acala-network/sdk-core'
import { TestType } from './dmp.test'

// make configurable / more generalised
export const buildTests = (tests: ReadonlyArray<TestType>) => {
  for (const { from, to, test, name} of tests) {
    describe(`'${from}' to '${to}' using bridgeSDK cross-chain '${token}'`, async () => {
      let fromchain: Network
      let tochain: Network

      const { alice } = testingPairs()

      describe('asset-hub kusama limited teleport assets', () => {
        beforeEach(async () => {
          const { [from]: fromchain1, [to]: tochain1 } = await createNetworks({
            [from]: undefined,
            [to]: undefined,
          })
          if (to == 'kusama') {
            await tochain1.dev.setStorage({
              Tokens: {
                Accounts: [
                  [[alice.address, { Token: 'DOT' }], { free: 10 * 1e12 }],
                ],
              },
            })
          }
          tochain = tochain1
          fromchain = fromchain1

          return async () => {
            await tochain.teardown()
            await fromchain.teardown()
          }
        })

        async function sleep(ms: number) {
          return new Promise((resolve) => setTimeout(resolve, ms))
        }

        async function chooseAdapter(chain: string, api: ApiPromise) {
          const adapters = {
            karura: KaruraAdapter,
            kusama: KusamaAdapter,
            moonriver: MoonriverAdapter,
            statemine: StatemineAdapter,
            basilisk: BasiliskAdapter,
            polkadot: PolkadotAdapter,
            statemint: StatemintAdapter,
            moonbeam: MoonbeamAdapter,
            acala: AcalaAdapter,
            bifrost: BifrostAdapter,
            altair: AltairAdapter,
            heiko: HeikoAdapter,
            shiden: ShidenAdapter,
            crust: ShadowAdapter,
            quartz: QuartzAdapter,
            unique: UniqueAdapter,
            astar: AstarAdapter,
            interlay: InterlayAdapter,
            kintsugi: KintsugiAdapter,
            parallel: ParallelAdapter,
            khala: KhalaAdapter,
            crab: CrabAdapter,
          } as any
          const adapter = new adapters[chain]()
          await adapter.init(api)
          return adapter
        }

        async function chainBalance(sdk: any, fromData: any, address: string) {
          const fromChainBalance = (await sdk.findAdapter(from).getTokenBalance(token, alice.address)).free.toNumber()
          let tokenDecimals = fromData.decimals
          let toChainBalance
          if (to == 'kusama-asset-hub') {
            const assetBalance = (
              await tochain.api.query.assets.account('10810581592933651521121702237638664357', address)
            ).value.balance
            toChainBalance =
              (String(assetBalance) as any) !== 'undefined' ? assetBalance.toNumber() / 10 ** fromData.decimals : 0
            tokenDecimals = 18
          } else {
            // handle error
          }

          return { address: address, fromChain: fromChainBalance, toChain: toChainBalance, decimals: tokenDecimals }
        }

        it('Should teleport native assets from the Relay Chain to the Assets Parachain', async () => {
          console.log('it: Should teleport native assets from the Relay Chain to the Assets Parachain')
          const fromChain = await chooseAdapter(from, fromchain.api)
          const toChain = await chooseAdapter(to, tochain.api)
          const sdk = new Bridge({ adapters: [fromChain as any, toChain as any] })
          const fromAdapter = sdk.findAdapter(from as any)
          const fromData = fromAdapter.getToken(token, fromAdapter.chain.id)

          const amount = new FixedPointNumber(2, fromData.decimals)
          const address =
            to === 'kusama-asset-hub' ? '0x4E7440dB498561A46AAa82b9Bc7d2D5162b5c27B' : alice.address

          const chainBalanceInitial = await chainBalance(sdk, fromData, address)
          await check(chainBalanceInitial).toMatchSnapshot('initial')
          const tx = fromAdapter
            .createTx({
              address: address,
              amount: amount,
              to: to as any,
              token: token,
            })
            .signAsync(alice)

          await sendTransaction(tx as any)
          await fromchain.chain.newBlock()
          await tochain.chain.newBlock()

          await sleep(100)
          const chainBalanceNow = await chainBalance(sdk, fromData, address)
          await check(chainBalanceNow).redact({ number: 3 }).toMatchSnapshot('after')

          //Verify if Destination Chain Transfer Fee matches the app
          expect(chainBalanceNow.fromChain).not.toEqual(chainBalanceInitial.fromChain)
          expect(chainBalanceNow.toChain).not.toEqual(chainBalanceInitial.toChain)

          if (!ignoreFee) {
            // const fee = amount.toNumber() - (chainBalanceNow.toChain - chainBalanceInitial.toChain)
            // await check(fee).redact({ number: 1 }).toMatchSnapshot('fee')
          }
        })
      })
    })
  }
}
