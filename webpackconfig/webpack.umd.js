// const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.umdcommon.js');
const commandArgs = require('../commandArgs');

const argsMap = commandArgs.initCommandArgs();

// const runtimePath = argsMap.get('--runtimepath')[0];
const customConfigPath = argsMap.get('--customconfig')[0];
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

// if (customConfigPath) {
//   customModule = require(customConfigPath);
//   if (customModule && customModule.getConfig) {
//     customModule = customModule.getConfig({
//       webpack,
//       curModule,
//       plugins: common.plugins
//     });
//   }
// }
//
// module.exports = merge(curModule, customModule || {});

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
