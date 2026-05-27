const path = require('path');
const rspack = require('@rspack/core');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { TsCheckerRspackPlugin } = require('ts-checker-rspack-plugin');
const UselessFilesCleanWebpackPlugin = require('useless-files-clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackBar = require('webpackbar');

const commandArgs = require('../commandArgs');
const Util = require('../util');
const { getPostCssConfigPath, isDev, isProd } = require('../util');

const {
  CssExtractRspackPlugin,
  CopyRspackPlugin,
  LightningCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPlugin,
} = rspack;

const argIndex = isDev() ? 7 : 6;
const runtimePath = commandArgs.toCommandArgs(process.argv[argIndex]).get('runtimepath');

const APP_PATH = path.resolve(runtimePath, 'src');

const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    isDev() ? 'react-refresh/babel' : null,
  ].filter((t) => t),
  cacheDirectory: isProd(),
};

module.exports = {
  plugins: {
    HtmlWebpackPlugin,
    MiniCssExtractPlugin: CssExtractRspackPlugin,
    CopyWebpackPlugin: CopyRspackPlugin,
    CssMinimizerPlugin: LightningCssMinimizerRspackPlugin,
    TerserPlugin: SwcJsMinimizerRspackPlugin,
    UselessFilesCleanWebpackPlugin,
    CompressionPlugin,
  },
  config: {
    entry: {
      index: Util.getEntryIndex(runtimePath),
    },
    output: {
      filename: isProd() ? '[name].[chunkhash].bundle.js' : '[name].[contenthash].bundle.js',
      chunkFilename: isProd() ? '[name].[chunkhash].bundle.js' : '[name].[contenthash].bundle.js',
      path: path.resolve(runtimePath, 'dist'),
      publicPath: '/',
      clean: true,
    },
    plugins: (isProd()
      ? [
          new CompressionPlugin({
            algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8,
          }),
        ]
      : []
    ).concat([
      new HtmlWebpackPlugin({
        title: '',
        filename: 'index.html',
        template: path.join(runtimePath, 'src', 'index.html'),
        hash: true,
        minify: {
          removeAttributeQuotes: true,
        },
        chunks: ['index'],
      }),
      new CssExtractRspackPlugin({
        filename: isDev() ? '[name].css' : '[name].[contenthash].css',
        chunkFilename: isDev() ? '[name].css' : '[name].[contenthash].css',
        ignoreOrder: false,
      }),
      new rspack.ProvidePlugin({
        _: 'lodash',
        $: 'jquery',
      }),
      new TsCheckerRspackPlugin({
        typescript: {
          configFile: path.join(runtimePath, 'tsconfig.json'),
        },
      }),
      new WebpackBar({ reporters: ['profile'], profile: true }),
      new UselessFilesCleanWebpackPlugin({
        root: APP_PATH,
        out: path.join(runtimePath, 'lessFiles'),
        clean: false,
        exclude: ['*.gitignore', 'node_modules'],
        log: 'console',
      }),
    ]),
    optimization: isDev()
      ? {
          splitChunks: false,
        }
      : {
          minimize: true,
          minimizer: [new SwcJsMinimizerRspackPlugin(), new LightningCssMinimizerRspackPlugin()],
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
          use: [
            {
              loader: 'babel-loader',
              options: babelConfig,
            },
          ],
        },
        {
          test: /\.m?tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: babelConfig,
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                happyPackMode: true,
                configFile: path.join(runtimePath, 'tsconfig.json'),
              },
            },
          ],
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
            isDev()
              ? 'style-loader'
              : {
                  loader: CssExtractRspackPlugin.loader,
                },
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
          ],
        },
        {
          test: /\.less$/,
          include: [APP_PATH, /normalize.less/],
          use: [
            isDev()
              ? 'style-loader'
              : {
                  loader: CssExtractRspackPlugin.loader,
                },
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
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
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
          use: [
            {
              loader: 'ejs-loader',
              options: {
                variable: 'data',
              },
            },
          ],
        },
        {
          test: /\.ya?ml$/,
          use: ['json-loader', 'yaml-loader'],
        },
        {
          test: /\.md$/,
          use: ['raw-loader'],
        },
      ],
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.sass', '.json'],
    },
  },
};
