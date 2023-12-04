import { assetHubKusamaPara, kusamaRelay } from '../../networks/asset-hub'
import buildTest from './shared'
import { kusama } from '../../networks/polkadot'
import { query, tx } from '../../helpers/api'

const tests = [
  {
    from: 'kusama',
    to: 'kusama-asset-hub',
    name: 'DMP',
    test: {
      xcmPalletDown:  {
        tx: tx.xcmPallet.limitedReserveTransferAssetsV3(kusama.ksm, 1e6, tx.xcmPallet.parachainV3(0, assetHubKusamaPara.paraId)),
        balance: query.assets(kusamaRelay.ksm),
      },
    },
  }
] as const

export type TestType = typeof tests[number]
buildTest(tests)