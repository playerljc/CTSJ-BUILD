const presets = [
  "@babel/preset-env",
];

const plugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-proposal-function-bind",
  "@babel/plugin-proposal-class-properties"
];

module.exports = {presets, plugins};