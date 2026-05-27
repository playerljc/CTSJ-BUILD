const { getPostCssConfigPath, slash, isDev } = require('../../util');
const { findAppLessRule } = require('./ruleUtils');

/**
 * cssModules
 * @param webpackConfig
 * @param plugins
 * @param theme
 * @param runtimePath
 */
module.exports = function ({ webpackConfig, plugins, theme = {}, runtimePath }) {
  const lessRule = findAppLessRule(webpackConfig);

  if (!lessRule) {
    return;
  }

  const cssLoader = lessRule.use.find((item) => typeof item === 'object' && item.loader === 'css-loader');
  const lessLoader = lessRule.use.find((item) => typeof item === 'object' && item.loader === 'less-loader');

  if (isDev()) {
    cssLoader.options.modules = {
      getLocalIdent: (context, localIdentName, localName) => {
        const filePath = context.resourcePath.replace('.less', '');

        const arr = slash(filePath)
          .split('/')
          .filter((t) => t)
          .map((a) => a.replace(/([A-Z])/g, '-$1'))
          .map((a) => a.toLowerCase());

        return `${arr.join('-')}-${localName}`.replace(/--/g, '-');
      },
      exportLocalsConvention: 'as-is',
      namedExport: false,
    };
    lessLoader.options.lessOptions = {
      modifyVars: theme,
    };
  } else {
    cssLoader.options.modules = {
      auto: true,
      exportLocalsConvention: 'as-is',
      namedExport: false,
    };
    lessLoader.options.lessOptions = {
      modifyVars: theme,
    };
  }

  webpackConfig.module.rules.push({
    test: /\.less$/,
    include: [/node_modules/],
    use: [
      isDev() ? 'style-loader' : plugins.MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            config: getPostCssConfigPath(runtimePath),
          },
        },
      },
      {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: theme,
          },
        },
      },
    ],
  });
};
