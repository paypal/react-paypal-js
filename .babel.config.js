module.exports = {
    presets: [
        '@babel/preset-react',
        [ '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                },
                loose: true,
            }
        ]
    ],
    plugins: ['@babel/plugin-syntax-jsx']
}
