const { findRuleByTest, getBabelLoaderUse } = require('./ruleUtils');

/**
 * 禁用use strict
 * @param webpackConfig
 */
module.exports = function ({ webpackConfig }) {
  const jsxRule = findRuleByTest(webpackConfig, /\.m?jsx?$/);
  const tsxRule = findRuleByTest(webpackConfig, /\.m?tsx?$/);

  const jsxBabelLoader = getBabelLoaderUse(jsxRule);
  const tsxBabelLoader = getBabelLoaderUse(tsxRule);

  if (jsxBabelLoader) {
    jsxBabelLoader.options.plugins.push([
      '@babel/plugin-transform-modules-commonjs',
      { strictMode: false },
    ]);
  }

  if (tsxBabelLoader) {
    tsxBabelLoader.options.plugins.push([
      '@babel/plugin-transform-modules-commonjs',
      { strictMode: false },
    ]);
  }
};
