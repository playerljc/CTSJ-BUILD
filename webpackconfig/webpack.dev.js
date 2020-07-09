// const path = require('path');
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const commandArgs = require("../commandArgs");
const argsMap = commandArgs.initCommandArgs();

// const runtimePath = argsMap.get('--runtimepath')[0];
const customConfigPath = argsMap.get("--customconfig")[0];
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
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    publicPath: "/",
    host: "localhost",
    compress: true,
    port: 8000,
    clientLogLevel: "none", //不再输出繁琐的信息
    historyApiFallback: true,
    overlay: true, //浏览器全屏显示错误信息
    hot: true, // 启动模块热更新 HMR
    open: true // 开启自动打开浏览器页面
  },
  plugins: [
    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify("development"),
          REAP_PATH: JSON.stringify(process.env.REAP_PATH)
        }
      }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
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

// const config = merge(curModule, customModule || {});
// module.exports = config;

const define = argsMap.get("--define")[0] || "";

if (customConfigPath) {
  customModule = require(customConfigPath);
  if (customModule && customModule.getConfig) {
    customModule.getConfig({
      webpack,
      curModule,
      plugins: common.plugins,
      define: commandArgs.toCommandArgs(define)
    });
  }
}

module.exports = curModule;
