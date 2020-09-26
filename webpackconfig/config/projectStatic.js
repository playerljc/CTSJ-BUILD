const path = require('path');

/**
 * 工程的静态资源拷贝
 * @param webpackConfig
 */
module.exports = function ({ webpackConfig, plugins, runtimePath }) {
  webpackConfig.plugins.push(
    new plugins.CopyWebpackPlugin([
      {
        from: path.join(runtimePath, 'assets'),
        to: 'assets',
        toType: 'dir',
      },
    ]),
  );
};
