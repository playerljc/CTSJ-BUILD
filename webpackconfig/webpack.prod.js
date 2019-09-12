const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const commandArgs = require('../commandArgs');
const argsMap = commandArgs.initCommandArgs();

const runtimePath = argsMap.get('--runtimepath')[0];
let customConfigPath = argsMap.get('--customconfig')[0];
let customModule;
// if (customConfig !== 'undefined') {
//   customConfigPath = path.join(runtimePath, customConfig);
// }
// else {
//   customConfigPath = path.join(runtimePath,'ctbuild.config.js');
// }

// --runtimepath
// --customconfig
const curModule = merge(common.config, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin([path.join(runtimePath, 'dist')]),
    new webpack.DefinePlugin({
      'process': {
        'env': {
          'NODE_ENV': JSON.stringify('production'),
          'REAP_PATH': JSON.stringify(process.env.REAP_PATH)
        }
      }
    }),
  ]
});

if (customConfigPath) {
  customModule = require(customConfigPath);
  if (customModule && customModule.getConfig) {
    customModule = customModule.getConfig({
      // webpack
      webpack,
      // 已经配置好的module
      curModule,
      // plugins
      plugins: common.plugins,
    });
  }
}

module.exports = merge(curModule, customModule || {});