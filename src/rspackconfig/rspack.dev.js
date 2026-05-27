const { ReactRefreshRspackPlugin } = require('@rspack/plugin-react-refresh');
const { merge } = require('webpack-merge');
const rspackBase = require('./rspack.base');
const common = require('./rspack.common.js');
const commandArgs = require('../commandArgs');
const runtimePath = commandArgs.toCommandArgs(process.argv[7]).get('runtimepath');

let webpackConfig = merge(common.config, {
  mode: 'development',
  target: 'web',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      publicPath: '/',
    },
    host: 'localhost',
    compress: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
    open: true,
    hot: true,
  },
  plugins: [new ReactRefreshRspackPlugin()],
});

webpackConfig = rspackBase({
  webpackConfig,
  runtimePath,
});

module.exports = webpackConfig;
