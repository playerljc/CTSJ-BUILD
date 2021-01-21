const path = require('path');

/**
 * 工程的静态资源拷贝
 * @param webpackConfig
 * @param plugins
 * @param runtimePath
 * @param val
 */
module.exports = function ({ webpackConfig, plugins, runtimePath, val }) {
  webpackConfig.plugins.push(
    new plugins.CopyWebpackPlugin([
      {
        from: path.join(runtimePath, val || 'assets'),
        to: val || 'assets',
        toType: 'dir',
      },
    ]),
  );
};
