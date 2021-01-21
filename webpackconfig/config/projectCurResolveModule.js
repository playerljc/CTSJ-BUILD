const path = require('path');

/**
 *  第三方包的引入是否从宿主工程的node_modules中进行查找
 *  resolve: {
 *     modules: [path.join(runtimePath, 'node_modules'), 'node_modules'],
 *  }
 * @param webpackConfig
 * @param runtimePath
 */
module.exports = function ({ webpackConfig, runtimePath }) {
  webpackConfig.resolve.modules.unshift(path.join(runtimePath, 'node_modules'));
};
