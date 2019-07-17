const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.umdcommon.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const commandArgs = require('../commandArgs');
const argsMap = commandArgs.initCommandArgs();

const runtimePath = argsMap.get('--runtimepath')[0];
let customConfig = argsMap.get('--customconfig')[0];
let customConfigPath, customModule;
if (customConfig !== 'undefined') {
  customConfigPath = `${runtimePath}${customConfig}`
}
else {
  customConfigPath = `${runtimePath}ctbuild.config.js`
}

// --runtimepath
// --customconfig
const curModule = merge(common.config, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin([`${runtimePath}umd`]),
    new webpack.DefinePlugin({
      'process': {
        'env': {
          'NODE_ENV': JSON.stringify('production'),
          'REAP_PATH': JSON.stringify(process.env.REAP_PATH),
        }
      }
    }),
  ]
});

if (customConfigPath) {
  customModule = require(customConfigPath);
  if (customModule && customModule.getConfig) {
    customModule = customModule.getConfig({
      webpack,
      curModule,
      plugins: common.plugins
    });
  }
}

module.exports = merge(curModule, customModule || {});