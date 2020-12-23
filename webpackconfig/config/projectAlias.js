const path = require('path');

/**
 * 加入工程的alias
 * @param webpackConfig
 */
module.exports = function ({ webpackConfig, runtimePath, val }) {
  webpackConfig.resolve.alias = {
    [val || '@']: path.join(runtimePath, 'src'),
  };
};
