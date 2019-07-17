const presets = [
  "@babel/preset-env",
  "@babel/preset-react",
];

const plugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-proposal-function-bind",
  "@babel/plugin-proposal-class-properties",
  ["import", {
    libraryName: "antd-mobile",
    style: 'css'
  }/*, {
    libraryName: "antd",
    style: true
  }*/],
];

module.exports = {presets, plugins};