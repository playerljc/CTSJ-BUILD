const projectAlias = require('./projectAlias');
const projectCssModules = require('./projectCssModules');
const projectEvnVars = require('./projectEvnVars');
const projectStatic = require('./projectStatic');
const projectBundleAnalyzer = require('./projectBundleAnalyzer');

const map = {
  analysis: {
    handler: projectBundleAnalyzer,
  },
  cssModules: {
    handler: projectCssModules,
  },
  evnVars: {
    handler: projectEvnVars,
  },
  static: {
    handler: projectStatic,
  },
  alias: {
    handler: projectAlias,
  },
};

module.exports = function ({ defineArgs, ...others }) {
  const keys = Object.getOwnPropertyNames(map);
  keys.forEach((key) => {
    const exists = defineArgs.has(key);
    if (exists) {
      map[key].handler({ ...others, val: defineArgs.get(key) });
    }
  });
};
