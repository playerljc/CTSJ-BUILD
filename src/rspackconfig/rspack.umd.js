const { merge } = require('webpack-merge');

const rspackBase = require('./rspack.base');
const common = require('./rspack.umdcommon.js');
const commandArgs = require('../commandArgs');

const runtimePath = commandArgs.toCommandArgs(process.argv[6]).get('runtimepath');

let webpackConfig = merge(common.config, {
  mode: 'production',
  devtool: 'cheap-module-source-map',
});

webpackConfig = rspackBase({
  webpackConfig,
  runtimePath,
});

module.exports = webpackConfig;
