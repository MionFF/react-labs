import { createDefaultEsmPreset } from 'ts-jest'

const tsJestPreset = createDefaultEsmPreset({
  tsconfig: './tsconfig.test.json',
})

/** @type {import('jest').Config} */
export default {
  ...tsJestPreset,

  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.test.tsx',
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.spec.tsx',
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },

  extensionsToTreatAsEsm: ['.ts', '.tsx'],

  transformIgnorePatterns: ['/node_modules/'],
}
