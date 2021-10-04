const path = require('path');
const { isDev } = require('../../util');
/**
 * 禁用use strict
 * @param webpackConfig
 * @param runtimePath
 */
module.exports = function ({ webpackConfig }) {
  const useIndex = isDev() ? 0 : 1;

  webpackConfig.module.rules[0].use[useIndex].options.plugins.push([
    '@babel/plugin-transform-modules-commonjs',
    { strictMode: false },
  ]);

  webpackConfig.module.rules[1].use[useIndex].options.plugins.push([
    '@babel/plugin-transform-modules-commonjs',
    { strictMode: false },
  ]);
};
