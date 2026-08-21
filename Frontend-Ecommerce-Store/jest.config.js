const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEach: [],
  setupFilesAfterEach: undefined,
}

module.exports = createJestConfig(customJestConfig)