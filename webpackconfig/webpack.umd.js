const webpack = require('webpack');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.umdcommon.js');
const commandArgs = require('../commandArgs');
const projectBundleAnalyzer = require('./config/projectBundleAnalyzer');

const argsMap = commandArgs.initCommandArgs();

// --runtimepath
// --customconfig

// webpack的配置
let webpackConfig = merge(common.config, {
  mode: 'production',
  plugins: [new CleanWebpackPlugin()],
});

// 附加的参数
const defineArgs = commandArgs.toCommandArgs(argsMap.get('--define')[0] || '');

// 用户自定义配置文件的路径
const customWebpackConfigPath = argsMap.get('--customconfig')[0];
let customWebpackConfig;
if (customWebpackConfigPath) {
  // 用户对webpackconfig对象进行修改形成用户自己的webpackconfig的配置对象里面有getTheme和getConfig
  customWebpackConfig = require(customWebpackConfigPath);
}

// 用户基于webpackconfig和projectconfig的配置进行二次配置
if (customWebpackConfig && customWebpackConfig.getConfig) {
  customWebpackConfig.getConfig({
    webpack,
    webpackConfig,
    plugins: common.plugins,
    define: defineArgs,
  });
}

// 是否进行打包分析
if (defineArgs.get('analysis')) {
  projectBundleAnalyzer({ webpackConfig });
  const smp = new SpeedMeasurePlugin();
  webpackConfig = smp.wrap(webpackConfig);
}

// 得到最终的配置
module.exports = webpackConfig;
