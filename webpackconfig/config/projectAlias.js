const path = require('path');

/**
 * 加入工程的alias
 * @param curModule
 */
module.exports = function ({ curModule, runtimePath }) {
  curModule.resolve.alias = {
    '@': path.join(runtimePath, 'src'),
  };
};
