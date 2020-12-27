const { getPostCssConfigPath, slash } = require('../../util');

/**
 * cssModules
 * @param webpackConfig
 */
module.exports = function ({ webpackConfig, plugins, theme = {}, runtimePath }) {
  const { mode } = process.env;

  const isDev = mode === 'development';

  if (isDev) {
    webpackConfig.module.rules[2].use[1].options.modules = {
      // localIdentName: '[path][name]__[local]--[hash:base64:5]',
      getLocalIdent: (context, localIdentName, localName) => {
        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
          const path = match[1].replace('.less', '');

          const arr = slash(path)
            .split('/')
            .filter((t) => t)
            .map((a) => a.replace(/([A-Z])/g, '-$1'))
            .map((a) => a.toLowerCase());

          return `${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }

        return localName;
      },
    };
    webpackConfig.module.rules[2].use[3].query.modifyVars = theme;
  } else {
    // include的APP_PATH中的less文件使用cssModules
    webpackConfig.module.rules[2].use[3].options.modules = true;
    webpackConfig.module.rules[2].use[5].query.modifyVars = theme;
  }

  // include是node_modules中的less文件不需要cssModules
  webpackConfig.module.rules.push({
    test: /\.less$/,
    include: [/node_modules/],
    use: [
      process.env.mode === 'development' ? 'style-loader' : plugins.MiniCssExtractPlugin.loader,
      'cache-loader',
      'thread-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: getPostCssConfigPath(runtimePath),
          },
        },
      },
      {
        loader: 'less-loader',
        query: {
          javascriptEnabled: true,
          modifyVars: theme,
        },
      },
    ],
  });
};
