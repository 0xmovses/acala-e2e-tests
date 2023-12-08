import { collectivesPolkadot, polkadot } from '../../networks/polkadot'
import { query, tx } from '../../helpers/api'
import buildTest from './shared'

const tests = [
  // polkadot -> collectives-polkadot
  {
    from: 'polkadot',
    to: 'collectives',
    route: 'polkadot',
    name: 'limitedTeleport',
    test: {
      xcmPalletLimitedTeleport: {
        tx: tx.xcmPallet.limitedTeleportAssets(polkadot.dot, 1e12, tx.xcmPallet.parachainV3(0, collectivesPolkadot.paraId)),
        systemBalance: query.systemBalance,
        tokensBalance: query.tokens(polkadot.dot),
      },
    },
  },
  {
    from: 'polkadot',
    to: 'collectives',
    route: 'polkadot',
    name: 'limitedReserve',
    test: {
      xcmPalletLimitedReserve: {
        tx: tx.xcmPallet.limitedReserveTransferAssetsV3(polkadot.dot, 1e12, tx.xcmPallet.parachainV3(0, collectivesPolkadot.paraId)),
        systemBalance: query.systemBalance,
        tokensBalance: query.tokens(polkadot.dot),
      },
    },
  },
] as const

export type TestType = typeof tests[number]
buildTest(tests)