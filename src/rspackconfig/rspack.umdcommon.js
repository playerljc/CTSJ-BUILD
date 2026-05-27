const path = require('path');
const rspack = require('@rspack/core');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { TsCheckerRspackPlugin } = require('ts-checker-rspack-plugin');
const WebpackBar = require('webpackbar');

const Util = require('../util');
const commandArgs = require('../commandArgs');
const { getPostCssConfigPath, isDev } = require('../util');

const {
  CssExtractRspackPlugin,
  LightningCssMinimizerRspackPlugin,
  SwcJsMinimizerRspackPlugin,
} = rspack;

const customArgs = commandArgs.toCommandArgs(process.argv[6]);

const runtimePath = customArgs.get('runtimepath');

const packagename = customArgs.get('packagename');

const APP_PATH = path.resolve(runtimePath, 'src');

module.exports = {
  plugins: {
    HtmlWebpackPlugin,
    MiniCssExtractPlugin: CssExtractRspackPlugin,
  },
  config: {
    entry: {
      index: Util.getEntryIndex(runtimePath),
    },
    output: {
      filename: `${packagename}.bundle.js`,
      path: path.resolve(runtimePath, 'umd'),
      publicPath: '/',
      library: `${packagename}`,
      libraryTarget: 'umd',
      libraryExport: 'default',
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: '',
        filename: 'index.html',
        template: path.join(runtimePath, 'index.html'),
        hash: true,
        minify: {
          removeAttributeQuotes: true,
        },
        chunks: ['index'],
      }),
      new CssExtractRspackPlugin({
        filename: `${packagename}.min.css`,
        ignoreOrder: false,
      }),
      new TsCheckerRspackPlugin({
        typescript: {
          configFile: path.join(runtimePath, 'tsconfig.json'),
        },
      }),
      new WebpackBar({ reporters: ['profile'], profile: true }),
    ],
    optimization: {
      minimize: true,
      minimizer: [new SwcJsMinimizerRspackPlugin(), new LightningCssMinimizerRspackPlugin()],
    },
    module: {
      rules: [
        {
          test: /\.m?jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      useBuiltIns: 'entry',
                      corejs: { version: 3, proposals: true },
                    },
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
                ],
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.m?tsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
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
          include: [APP_PATH, /highlight.js/, /photoswipe.css/, /default-skin.css/],
          use: [
            isDev() ? 'style-loader' : CssExtractRspackPlugin.loader,
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
            isDev() ? 'style-loader' : CssExtractRspackPlugin.loader,
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
          use: 'raw-loader',
        },
      ],
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.sass', '.json'],
    },
  },
};
