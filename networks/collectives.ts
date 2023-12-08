import { Config } from './types'

export default {
  polkadot: {
    name: 'polkadot' as const,
    endpoint: 'wss://rpc.polkadot.io',
  },
  kusama: {
    name: 'collectives' as const,
    endpoint: 'wss://polkadot-collectives-rpc.polkadot.io',
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
  ksm: { Token: 'KSM'}
} as const


export const collectives = {
  paraId: 2000,
  paraAccount: '13YMK2eYoAvStnzReuxBjMrAvPXmmdsURwZvc62PrdXimbNy',
  dot: { Token: 'DOT' },
  ksm: { Token: 'KSM' },
} as const