const projectAlias = require('./projectAlias');
const projectCssModules = require('./projectCssModules');
const projectEvnVars = require('./projectEvnVars');
const projectStatic = require('./projectStatic');
const projectBundleAnalyzer = require('./projectBundleAnalyzer');

module.exports = function ({ curModule, runtimePath, plugins, webpack, theme }) {
  projectAlias({ curModule, runtimePath });
  projectCssModules({ curModule, plugins, theme });
  projectEvnVars({ curModule, webpack });
  projectStatic({ curModule, plugins, runtimePath });
  projectBundleAnalyzer({ curModule });
};
