const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const commandArgs = require('../commandArgs');
const projectConfigMerge = require('./config/index.js');

const argsMap = commandArgs.initCommandArgs();

const runtimePath = process.argv[8];

const customConfigPath = argsMap.get('--customconfig')[0];

// --runtimepath
// --customconfig

const curModule = merge(common.config, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    publicPath: '/',
    host: 'localhost',
    compress: true,
    port: 8000,
    clientLogLevel: 'none', // 不再输出繁琐的信息
    historyApiFallback: true,
    overlay: true, // 浏览器全屏显示错误信息
    hot: true, // 启动模块热更新 HMR
    open: true, // 开启自动打开浏览器页面
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify('development'),
          REAP_PATH: JSON.stringify(process.env.REAP_PATH),
        },
      },
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
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
