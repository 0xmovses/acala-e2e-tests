import { assetHubKusamaPara } from '../../networks/asset-hub'
import { kusama } from '../../networks/polkadot'
import { query, tx } from '../../helpers/api'
import buildTest from './shared'

const tests = [
  // kusama <-> kusama-asset-hub
  {
    from: 'kusama',
    to: 'kusama-asset-hub',
    route: 'kusama',
    name: 'DMP',
    test: {
      xcmPalletDown: {
        tx: tx.xcmPallet.limitedReserveTransferAssetsV3(kusama.ksm, 1e12, tx.xcmPallet.parachainV3(0, assetHubKusamaPara.paraId)),
        systemBalance: query.systemBalance,
        tokensBalance: query.tokens(assetHubKusamaPara.ksm),
      },
    },
  },
  {
    from: 'kusama-asset-hub',
    to: 'kusama',
    route: 'kusama',
    name: 'UMP',
    test: {
      xcmPalletUp: {
        tx: tx.xcmPallet.limitedReserveTransferAssetsV3(assetHubKusamaPara.ksm, 1e12, tx.xcmPallet.relaychainV3),
        systemBalance: query.systemBalance,
        tokensBalance: query.tokens(assetHubKusamaPara.ksm),
      },
    },
  },

] as const

export type TestType = typeof tests[number]
buildTest(tests)