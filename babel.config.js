// 配置文件路径
const configPath = process.env.configPath;

const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      corejs: { version: 3, proposals: true },
    },
  ],
  '@babel/preset-react',
];

const plugins = [
  '@babel/plugin-transform-runtime',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-proposal-function-bind',
  '@babel/plugin-proposal-optional-chaining',
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: false }],
];

const config = { presets, plugins };

if (configPath) {
  const customBabelConfig = require(configPath);

  if (customBabelConfig && customBabelConfig.getConfig) {
    customBabelConfig.getConfig(config);
  }
}

module.exports = config;
