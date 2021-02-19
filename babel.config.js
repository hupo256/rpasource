module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: [
    '@babel/plugin-transform-arrow-functions',
    '@babel/plugin-proposal-class-properties',
    './scripts/plugin/auto-css-modules.js',
    [
      'import',
      {
        libraryName: 'antd',
        // "libraryDirectory": "es",
        style: 'true',
      },
    ],
    '@babel/plugin-transform-runtime',
  ],
}
