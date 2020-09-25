const path = require('path');

/**
 * 工程的静态资源拷贝
 * @param curModule
 */
module.exports = function ({ curModule, plugins, runtimePath }) {
  curModule.plugins.push(
    new plugins.CopyWebpackPlugin([
      {
        from: path.join(runtimePath, 'assets'),
        to: 'assets',
        toType: 'dir',
      },
    ]),
  );
};
