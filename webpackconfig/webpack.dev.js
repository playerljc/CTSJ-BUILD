const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBase = require('./webpack.base');
const common = require('./webpack.common.js');

const runtimePath = process.argv[8];

// --runtimepath
// --customconfig

// webpack的配置
let webpackConfig = merge(common.config, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    publicPath: '/',
    host: 'localhost',
    compress: true,
    // port: 8000,
    clientLogLevel: 'none', // 不再输出繁琐的信息
    historyApiFallback: true,
    overlay: true, // 浏览器全屏显示错误信息
    hot: true, // 启动模块热更新 HMR
    open: true, // 开启自动打开浏览器页面
  },
  plugins: [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin()],
});

webpackConfig = webpackBase({
  webpackConfig,
  runtimePath,
});

// 得到最终的配置
module.exports = webpackConfig;
