const path = require('path');

/**
 * 加入工程的alias
 * @param curModule
 */
module.exports = function ({ webpackConfig, runtimePath }) {
  webpackConfig.resolve.alias = {
    '@': path.join(runtimePath, 'src'),
  };
};
