const webpack = require('webpack');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const common = require('./webpack.common.js');
const commandArgs = require('../commandArgs');
const projectWebpackConfigMerge = require('./config/index.js');
const projectBundleAnalyzer = require('./config/projectBundleAnalyzer');

const argsMap = commandArgs.initCommandArgs();

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
