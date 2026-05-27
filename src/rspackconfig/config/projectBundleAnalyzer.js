const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * 依赖的分析
 * @param webpackConfig
 */
module.exports = function ({ webpackConfig }) {
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
};
