const testConfig = {
    presets: [
        '@babel/preset-typescript',
        '@babel/preset-env',
        [
            '@babel/preset-react',
            {
                runtime: 'automatic',
            },
        ],
    ],
    plugins: ['babel-plugin-transform-import-meta', 'css-modules-transform'],
}

module.exports = process.env.NODE_ENV === 'test' ? testConfig : {}
