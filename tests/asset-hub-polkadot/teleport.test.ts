import { collectives, polkadot } from '../../networks/polkadot'
import { query, tx } from '../../helpers/api'
import buildTest from './shared'

const tests = [
  // polkadot <-> collectives parachain
  {
    from: 'polkadot',
    to: 'collectives',
    route: 'polkadot',
    name: 'teleport assets to collectives parachain',
    test: {
      xcmPalletDown: {
        tx: tx.xcmPallet.limitedTeleportAssets(polkadot.dot, 1e12, tx.xcmPallet.parachainV3(0, collectives.paraId)),
        systemBalance: query.systemBalance,
      },
    },
  },
] as const

export type TestType = typeof tests[number]
buildTest(tests)