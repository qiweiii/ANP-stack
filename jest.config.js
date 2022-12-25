module.exports = {
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testEnvironment: 'node',
  // Each setupFile will be run once per test file
  setupFilesAfterEnv: ['<rootDir>/tests/helpers/setup.ts'],
  collectCoverage: true,
  coverageReporters: ['text-summary'],
};
