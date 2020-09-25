const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.umdcommon.js');
const commandArgs = require('../commandArgs');

const argsMap = commandArgs.initCommandArgs();

const customConfigPath = argsMap.get('--customconfig')[0];
let customModule;

// --runtimepath
// --customconfig
const curModule = merge(common.config, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify('production'),
          REAP_PATH: JSON.stringify(process.env.REAP_PATH),
        },
      },
    }),
  ],
});

const define = argsMap.get('--define')[0] || '';

if (customConfigPath) {
  customModule = require(customConfigPath);
  if (customModule && customModule.getConfig) {
    customModule.getConfig({
      webpack,
      curModule,
      plugins: common.plugins,
      define: commandArgs.toCommandArgs(define),
    });
  }
}

module.exports = curModule;
