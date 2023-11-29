import { buildTests } from './shared'
const tests = [
  {
    from: 'kusama',
    to: 'kusama-asset-hub',
    token: 'DOT',
  }
] as const

buildTests(tests)