import { assetHubKusamaPara, kusamaRelay } from '../../networks/asset-hub'
import { kusama } from '../../networks/polkadot'
import { query, tx } from '../../helpers/api'
import buildTest from './shared'

const tests = [
  {
    from: 'kusama',
    route: 'kusama',
    to: 'kusama-asset-hub',
    name: 'DMP',
    test: {
      xcmPalletDown:  {
        tx: tx.xcmPallet.limitedReserveTransferAssetsV3(kusama.ksm, 1e6, tx.xcmPallet.parachainV3(0, assetHubKusamaPara.paraId)),
        balance: query.assets(kusamaRelay.ksm),
      },
    },
  },
  // {
  //   from: 'kusama-asset-hub',
  //   route: 'kusama',
  //   to: 'kusama',
  //   name: 'DMP',
  //   test: {
  //     xcmPalletDown:  {
  //       tx: tx.xcmPallet.limitedReserveTransferAssetsV3(kusamaRelay.ksm, 1e6, tx.xcmPallet.parachainV3(0, kusama.paraId)),
  //       balance: query.assets(kusamaRelay.ksm),
  //     },
  //   },
  // },
  // {
  //   from: 'kusama',
  //   route: 'kusama',
  //   to: 'kusama-asset-hub',
  //   name: 'DMP',
  //   test: {
  //     xcmPalletDown:  {
  //       tx: tx.xcmPallet.limitedReserveTransferAssetsV3(kusama.ksm, 1e6, tx.xcmPallet.parachainV3(0, assetHubKusamaPara.paraId)),
  //       balance: query.assets(kusamaRelay.ksm),
  //     },
  //   },
  // },
  // {
  //   from: 'kusama-asset-hub',
  //   route: 'kusama',
  //   to: 'kusama',
  //   name: 'DMP',
  //   test: {
  //     xcmPalletDown:  {
  //       tx: tx.xcmPallet.limitedReserveTransferAssetsV3(kusamaRelay.ksm, 1e6, tx.xcmPallet.parachainV3(0, kusama.paraId)),
  //       balance: query.assets(kusamaRelay.ksm),
  //     },
  //   },
  // },
  // {
  //   from: 'kusama',
  //   route: 'kusama',
  //   to: 'kusama-asset-hub',
  //   name: 'DMP',
  //   test: {
  //     xcmPalletDown:  {
  //       tx: tx.xcmPallet.limitedReserveTransferAssetsV3(kusama.ksm, 1e6, tx.xcmPallet.parachainV3(0, assetHubKusamaPara.paraId)),
  //       balance: query.assets(kusamaRelay.ksm),
  //     },
  //   },
  // },
  // {
  //   from: 'kusama-asset-hub',
  //   route: 'kusama',
  //   to: 'kusama',
  //   name: 'DMP',
  //   test: {
  //     xcmPalletDown:  {
  //       tx: tx.xcmPallet.limitedReserveTransferAssetsV3(kusamaRelay.ksm, 1e6, tx.xcmPallet.parachainV3(0, kusama.paraId)),
  //       balance: query.assets(kusamaRelay.ksm),
  //     },
  //   },
  // },
] as const

export type TestType = typeof tests[number]
buildTest(tests)