const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const common = require('./webpack.common.js');
const commandArgs = require('../commandArgs');
const projectWebpackConfigMerge = require('./config/index.js');

module.exports = function ({ webpackConfig, runtimePath }) {
  const argsMap = commandArgs.initCommandArgs();

  // --runtimepath
  // --customconfig

  // 附加的参数
  const defineArgs = commandArgs.toCommandArgs(argsMap.get('--define')[0] || '');

  // 用户自定义配置文件的路径
  const customWebpackConfigPath = argsMap.get('--customconfig')[0];

  let customWebpackConfig;

  if (customWebpackConfigPath) {
    // 用户对webpackconfig对象进行修改形成用户自己的webpackconfig的配置对象里面有getTheme和getConfig
    customWebpackConfig = require(customWebpackConfigPath);
  }

  // 基于webpackconfig进行项目配置，如@别名,cssmodules,less主题,assets目录,变量,打包分析等设置
  const projectWebpackConfigMergeParams = {
    webpackConfig,
    runtimePath,
    plugins: common.plugins,
    webpack,
    defineArgs,
  };

  if (customWebpackConfig && customWebpackConfig.getTheme) {
    projectWebpackConfigMergeParams.theme = customWebpackConfig.getTheme({
      webpack,
      webpackConfig,
      plugins: common.plugins,
      define: defineArgs,
    });
  }

  projectWebpackConfigMerge(projectWebpackConfigMergeParams);

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
    const smp = new SpeedMeasurePlugin();

    webpackConfig = smp.wrap(webpackConfig);
  }

  return webpackConfig;
};
