import { Config } from './types'

export default {
  polkadot: {
    name: 'polkadot-asset-hub' as const,
    endpoint: 'wss://polkadot-asset-hub-rpc.polkadot.io',
  },
  kusama: {
    name: 'kusama-asset-hub' as const,
    endpoint: 'wss://kusama-asset-hub-rpc.polkadot.io',
  },
  config: ({ alice }) => ({
    storages: {
      System: {
        Account: [[[alice.address], { providers: 1, data: { free: 10 * 1e12 } }]],
      },
    },
  }),
} satisfies Config

export const kusamaRelay = {
  paraId: 1000,
  account: 'GcZpdmAoXNvPoivLXh25G5BoAFAdc62UTuutBHir8g5aPRM',
  ksm: 340282366920938463463374607431768211454n,
} as const

export const assetHubKusamaPara= {
  paraId: 1000,
  account: '5G6xAKRJBAMze9uUZpsyBJiBeZxvpwGr265AVX1mNLTaqLZd',
  ksm: 340282366920938463463374607431768211455n,
} as const
