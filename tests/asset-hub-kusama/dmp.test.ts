import { buildTests } from './shared'
const tests = [
  {
    from: 'kusama',
    to: 'kusama-asset-hub',
    token: 'DOT',
  }
] as const

export type TestType = typeof tests[number]
buildTests(tests)