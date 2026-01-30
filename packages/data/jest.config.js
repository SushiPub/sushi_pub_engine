module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^@socialpublisher/core$': '<rootDir>/../core/src',
  },
  //setupFiles: ['<rootDir>/tests/setup.ts'],
};
