const rspack = require('@rspack/core');

const common = require('./rspack.common.js');
const commandArgs = require('../commandArgs');
const projectRspackConfigMerge = require('./config/index.js');

module.exports = function ({ webpackConfig, runtimePath }) {
  const argsMap = commandArgs.initCommandArgs();

  const env = commandArgs.toCommandArgs(argsMap.get('--env').join(' '));

  const defineArgs = commandArgs.toCommandArgs(
    JSON.parse(Buffer.from(env.get('define'), 'base64').toString() || '[]').join(' '),
  );

  const customWebpackConfigPath = env.get('customconfig');

  let customWebpackConfig;

  if (customWebpackConfigPath) {
    customWebpackConfig = require(customWebpackConfigPath);
  }

  const projectRspackConfigMergeParams = {
    webpackConfig,
    runtimePath,
    plugins: common.plugins,
    webpack: rspack,
    defineArgs,
  };

  if (customWebpackConfig && customWebpackConfig.getTheme) {
    projectRspackConfigMergeParams.theme = customWebpackConfig.getTheme({
      webpack: rspack,
      webpackConfig,
      plugins: common.plugins,
      define: defineArgs,
    });
  }

  projectRspackConfigMerge(projectRspackConfigMergeParams);

  if (customWebpackConfig && customWebpackConfig.getConfig) {
    customWebpackConfig.getConfig({
      webpack: rspack,
      webpackConfig,
      plugins: common.plugins,
      define: defineArgs,
    });
  }

  return webpackConfig;
};
