import { Config } from './types'

import polkadotConfig from './polkadot'
import collectivesConfig from './collectives'
import assetHubConfig from './asset-hub'

const all = {
  polkadot: polkadotConfig,
  assetHub: assetHubConfig,
  collectives: collectivesConfig,
} satisfies Record<string, Config>

export default all
