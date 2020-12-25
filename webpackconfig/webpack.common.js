const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackBar = require('webpackbar');
const TerserPlugin = require('terser-webpack-plugin');
const Util = require('../util');

const runtimePath = process.argv[8];
const APP_PATH = path.resolve(runtimePath, 'src'); // 项目src目录
const { getPostCssConfigPath } = require('../util');

const { mode } = process.env;

const isDev = mode === 'development';

const devLoaders = isDev ? [] : ['cache-loader', 'thread-loader'];

module.exports = {
  plugins: {
    HtmlWebpackPlugin,
    MiniCssExtractPlugin,
    CopyWebpackPlugin,
    HtmlWebpackIncludeAssetsPlugin,
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
      path: path.resolve(runtimePath, 'dist'),
      publicPath: '/',
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new HtmlWebpackPlugin({
        title: '',
        filename: 'index.html',
        template: path.join(runtimePath, 'src', 'index.html'),
        hash: true, // 防止缓存
        minify: {
          removeAttributeQuotes: true, // 压缩 去掉引号
        },
        chunks: ['index'],
      }),
      new webpack.HashedModuleIdsPlugin(),
      new MiniCssExtractPlugin({
        filename: mode === 'development' ? '[name].css' : '[name].[hash].css',
        chunkFilename: mode === 'development' ? '[id].css' : '[id].[hash].css',
        ignoreOrder: false,
      }),
      new webpack.ProvidePlugin({
        _: 'lodash',
        $: 'jquery',
      }),
      new WebpackBar({ reporters: ['profile'], profile: true }),
    ],
    optimization: {
      minimize: !isDev, // true,
      minimizer: isDev
        ? []
        : [
            new TerserPlugin({
              sourceMap: mode !== 'production',
            }),
            new OptimizeCSSAssetsPlugin({}),
          ],
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
          include: [APP_PATH],
          use: devLoaders.concat([
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
          ]),
        },
        {
          test: /\.css$/,
          include: [
            APP_PATH,
            /highlight.js/,
            /photoswipe.css/,
            /default-skin.css/,
            /swiper.min.css/,
            /antd/,
            /antd-mobile/,
            /normalize.css/,
          ],
          use: [
            mode === 'development'
              ? 'style-loader'
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: mode === 'development',
                  },
                },
          ]
            .concat(devLoaders)
            .concat([
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
            ]),
        },
        {
          test: /\.less$/,
          include: [APP_PATH, /normalize.less/],
          use: [
            mode === 'development'
              ? 'style-loader'
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: mode === 'development',
                  },
                },
          ]
            .concat(devLoaders)
            .concat([
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
            ]),
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
        {
          test: /\.ya?ml$/,
          use: ['json-loader', 'yaml-loader'],
        },
      ],
    },
    resolve: {
      modules: [path.join(runtimePath, 'node_modules'), 'node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.sass', '.json'], // 后缀名自动补全
    },
  },
};
