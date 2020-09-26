const projectAlias = require('./projectAlias');
const projectCssModules = require('./projectCssModules');
const projectEvnVars = require('./projectEvnVars');
const projectStatic = require('./projectStatic');

module.exports = function ({ webpackConfig, runtimePath, plugins, webpack, theme }) {
  projectAlias({ webpackConfig, runtimePath });
  projectCssModules({ webpackConfig, plugins, theme });
  projectEvnVars({ webpackConfig, webpack });
  projectStatic({ webpackConfig, plugins, runtimePath });
};
