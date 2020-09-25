const webpack = require('webpack');
const merge = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.common.js');
const commandArgs = require('../commandArgs');
const projectConfigMerge = require('./config/index.js');

const argsMap = commandArgs.initCommandArgs();

const runtimePath = process.argv[8];

const customConfigPath = argsMap.get('--customconfig')[0];

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

let customModule;
if (customConfigPath) {
  customModule = require(customConfigPath);
}

const projectConfigMergeParams = {
  curModule,
  runtimePath,
  plugins: common.plugins,
  webpack,
};
if(customModule && customModule.getTheme) {
  projectConfigMergeParams.theme = customModule.getTheme();
}
projectConfigMerge(projectConfigMergeParams);

if (customModule && customModule.getConfig) {
  customModule.getConfig({
    webpack,
    curModule,
    plugins: common.plugins,
    define: commandArgs.toCommandArgs(define),
  });
}

module.exports = curModule;
