const webpack = require('webpack');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.common.js');
const commandArgs = require('../commandArgs');
const projectWebpackConfigMerge = require('./config/index.js');
const projectBundleAnalyzer = require('./config/projectBundleAnalyzer');

const argsMap = commandArgs.initCommandArgs();

const runtimePath = process.argv[8];

// --runtimepath
// --customconfig

let webpackConfig = merge(common.config, {
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

// 附加的参数
const defineArgs = commandArgs.toCommandArgs(argsMap.get('--define')[0] || '');

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
};
if (customWebpackConfig && customWebpackConfig.getTheme) {
  projectWebpackConfigMergeParams.theme = customWebpackConfig.getTheme();
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
  projectBundleAnalyzer({ webpackConfig });
  const smp = new SpeedMeasurePlugin();
  webpackConfig = smp.wrap(webpackConfig);
}

// 得到最终的配置
module.exports = webpackConfig;
