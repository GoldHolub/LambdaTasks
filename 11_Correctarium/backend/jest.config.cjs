module.exports = {
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
};