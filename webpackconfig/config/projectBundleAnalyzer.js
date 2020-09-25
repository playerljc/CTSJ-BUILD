const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * 依赖的分析
 * @param curModule
 */
module.exports = function ({ curModule }) {
  curModule.plugins.push(new BundleAnalyzerPlugin());
};
