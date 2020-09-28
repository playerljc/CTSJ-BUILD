const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const Util = require('../util');

const runtimePath = process.argv[8];
const packagename = process.argv[10];
const APP_PATH = path.resolve(runtimePath, 'src'); // 项目src目录
const { getPostCssConfigPath } = require('../util');

const { mode } = process.env;

module.exports = {
  plugins: {
    HtmlWebpackPlugin,
    MiniCssExtractPlugin,
  },
  config: {
    /**
     * 入口
     */
    entry: {
      // 判断入口文件是.js,.jsx,.tsx
      index: Util.getEntryIndex(runtimePath),
    },
    /**
     * 出口
     */
    output: {
      filename: mode === 'production' ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
      chunkFilename:
        mode === 'production' ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
      path: path.resolve(runtimePath, 'umd'),
      publicPath: '/',
      library: `${packagename}`,
      libraryTarget: 'umd',
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      // 请确保引入这个插件！
      new HtmlWebpackPlugin({
        title: '',
        filename: 'index.html',
        template: path.join(runtimePath, 'index.html'),
        hash: true, // 防止缓存
        minify: {
          removeAttributeQuotes: true,
        },
        chunks: ['index'],
      }),
      new webpack.HashedModuleIdsPlugin(),
      new MiniCssExtractPlugin({
        ilename: mode === 'development' ? '[name].css' : '[name].[hash].css',
        chunkFilename: mode === 'development' ? '[id].css' : '[id].[hash].css',
        ignoreOrder: false,
      }),
      new WebpackBar({ reporters: ['profile'], profile: true }),
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.m?jsx?$/,
          exclude: /(node_modules|bower_components)/,
          // include: [APP_PATH],
          use: [
            'cache-loader',
            'thread-loader',
            {
              loader: 'babel-loader',
              query: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'usage',
                      corejs: { version: 3, proposals: true },
                    },
                  ],
                  '@babel/preset-react',
                ],
                plugins: [
                  '@babel/plugin-transform-runtime',
                  '@babel/plugin-syntax-dynamic-import',
                  '@babel/plugin-proposal-function-bind',
                  '@babel/plugin-proposal-class-properties',
                ],
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: [APP_PATH, /highlight.js/, /photoswipe.css/, /default-skin.css/],
          use: [
            mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
          ],
        },
        {
          test: /\.less$/,
          include: [APP_PATH, /normalize.less/],
          use: [
            mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
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
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024,
              },
            },
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1024,
              },
            },
          ],
        },
        {
          test: /\.(csv|tsv)$/,
          use: ['csv-loader'],
        },
        {
          test: /\.xml$/,
          use: ['xml-loader'],
        },
        {
          test: /\.ejs/,
          loader: ['ejs-loader?variable=data'],
        },
      ],
    },
    resolve: {
      modules: [path.join(runtimePath, 'node_modules'), 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.sass', '.json'], // 后缀名自动补全
    },
  },
};
