module.exports = {
    testEnvironment: 'jsdom',
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)$': 'babel-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(css-modules-transform)/)',
    ],
    moduleNameMapper: {
        '\\.module\\.css$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
};