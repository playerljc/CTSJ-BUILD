const { merge } = require('webpack-merge');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpackBase = require('./webpack.base');
const common = require('./webpack.umdcommon.js');

const runtimePath = commandArgs.toCommandArgs(process.argv[10]).get('runtimepath');

// --runtimepath
// --customconfig

// webpack的配置
let webpackConfig = merge(common.config, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  // plugins: [new CleanWebpackPlugin()],
});

webpackConfig = webpackBase({
  webpackConfig,
  runtimePath,
});

// 得到最终的配置
module.exports = webpackConfig;
