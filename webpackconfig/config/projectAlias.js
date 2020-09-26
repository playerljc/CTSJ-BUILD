const path = require('path');

/**
 * 加入工程的alias
 * @param webpackConfig
 */
module.exports = function ({ webpackConfig, runtimePath }) {
  webpackConfig.resolve.alias = {
    '@': path.join(runtimePath, 'src'),
  };
};
