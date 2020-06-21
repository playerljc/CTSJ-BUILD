const presets = [
  "@babel/preset-env",
  "@babel/preset-react",
  // TODO: babel.config.js 中babel对typescript的支持
  // [
  //   "@babel/preset-typescript",
  //   {
  //     isTSX: true,
  //     allExtensions: true,
  //   },
  // ],
];

const plugins = [
  "@babel/plugin-transform-runtime",
  '@babel/plugin-syntax-dynamic-import',
  "@babel/plugin-proposal-function-bind",
  '@babel/plugin-proposal-optional-chaining',
  ['@babel/plugin-proposal-decorators',{ legacy: true }],
  ['@babel/plugin-proposal-class-properties', { loose: true }],
  // "transform-vue-jsx",
  // [
  //   "import",
  //   {
  //     libraryName: "antd-mobile",
  //     style: 'css'
  //   }/*, {
  //   libraryName: "antd",
  //   style: true
  // }*/],
];

module.exports = {presets, plugins};
