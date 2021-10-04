const webpack = require('webpack');
const { merge } = require('webpack-merge');
const webpackBase = require('./webpack.base');
const common = require('./webpack.common.js');
const commandArgs = require('../commandArgs');
const runtimePath = commandArgs.toCommandArgs(process.argv[8]).get('runtimepath');

// --runtimepath
// --customconfig

// webpack的配置
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
    // clientLogLevel: 'none', // 不再输出繁琐的信息
    historyApiFallback: true,
    client: {
      overlay: true, // 浏览器全屏显示错误信息
    },
    hot: true, // 启动模块热更新 HMR
    open: true, // 开启自动打开浏览器页面
  },
  plugins: [/*new webpack.NamedModulesPlugin(), */ new webpack.HotModuleReplacementPlugin()],
});

webpackConfig = webpackBase({
  webpackConfig,
  runtimePath,
});

console.log('webpackConfig', webpackConfig);
// 得到最终的配置
module.exports = webpackConfig;
