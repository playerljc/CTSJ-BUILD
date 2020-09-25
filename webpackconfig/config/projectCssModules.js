const path = require('path');

/**
 * cssModules
 * @param curModule
 */
module.exports = function ({ curModule, plugins, theme = {} }) {
  // include的APP_PATH中的less文件使用cssModules
  curModule.module.rules[2].use[3].options.modules = true;
  curModule.module.rules[2].use[5].query.modifyVars = theme;

  // include是node_modules中的less文件不需要cssModules
  curModule.module.rules.push({
    test: /\.less$/,
    include: [/node_modules/],
    use: [
      process.env.NODE_ENV === 'development' ? 'style-loader' : plugins.MiniCssExtractPlugin.loader,
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
