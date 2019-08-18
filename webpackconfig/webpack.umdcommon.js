const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const runtimePath = process.argv[6];
const packagename = process.argv[8];

// const extractLess = new ExtractTextPlugin({
//   filename: (getPath) => {
//     return getPath(`${packagename}.css`);
//   },
//   allChunks: true
// });

// console.log('umd-packagename', packagename);
// console.log('umd-runtimePath', runtimePath);
const APP_PATH = path.resolve(runtimePath, 'src'); // 项目src目录
// console.log('umd-APP_PATH', APP_PATH);

module.exports = {
  plugins: {
    HtmlWebpackPlugin,
    HtmlWebpackPlugin,
    // ExtractTextPlugin,
    MiniCssExtractPlugin,
    LessPluginCleanCSS,
    LessPluginAutoPrefix,
    VueLoaderPlugin
  },
  config: {
    entry: {
      index: path.join(runtimePath, 'src', 'index.js'),//`${runtimePath}src\\index.js`,
    },
    output: {
      filename: `${packagename}.bundle.js`,
      chunkFilename: `${packagename}.bundle.js`,
      path: path.resolve(runtimePath, 'umd'),
      publicPath: '/',
      library: `${packagename}`,
      libraryTarget: 'umd'
    },
    plugins: [
      // 请确保引入这个插件！
      // new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        title: 'CtMobile Demo',
        filename: 'index.html',
        template: path.join(runtimePath, 'index.html'),//`${runtimePath}\\index.html`,
        hash: true,//防止缓存
        minify: {
          removeAttributeQuotes: true//压缩 去掉引号
        },
        chunks: ["index"]
      }),
      new webpack.HashedModuleIdsPlugin(),
      // extractLess,
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // all options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
        ignoreOrder: false, // Enable to remove warnings about conflicting order
      }),
    ],
    // optimization: {
    //   runtimeChunk: 'single',
    //   splitChunks: {
    //     cacheGroups: {
    //       vendor: {
    //         test: /[\\/]node_modules[\\/]/,
    //         name: 'vendors',
    //         chunks: 'all'
    //       }
    //     }
    //   }
    // },
    module: {
      rules: [
        {
          test: /\.m?jsx?$/,
          exclude: /(node_modules|bower_components)/,
          // include: [APP_PATH],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/plugin-transform-runtime',
                "@babel/plugin-syntax-dynamic-import",
                "@babel/plugin-proposal-function-bind",
                "@babel/plugin-proposal-class-properties"
              ]
            }
          }
        },
        {
          test: /\.css$/,
          include: [APP_PATH, /highlight.js/, /photoswipe.css/, /default-skin.css/],
          // use: ExtractTextPlugin.extract({
          //   fallback: "style-loader",
          //   use: "css-loader"
          // })
          use: [
            process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.less$/,
          include: [APP_PATH, /normalize.less/],
          use: [
            process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: "less-loader",
              options: {
                plugins: [
                  new LessPluginCleanCSS({advanced: true}),
                  new LessPluginAutoPrefix({add: false, remove: false, browsers: ['last 2 versions']})
                ]
              }
            }
          ]
          //   ExtractTextPlugin.extract({
          //   use: [{
          //     loader: "css-loader"
          //   }, {
          //     loader: "less-loader",
          //     options: {
          //       plugins: [
          //         new LessPluginCleanCSS({advanced: true}),
          //         new LessPluginAutoPrefix({add: false, remove: false, browsers: ['last 2 versions']})
          //       ]
          //     }
          //   }],
          //   fallback: "style-loader"
          // })
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            'file-loader'
          ]
        },
        {
          test: /\.(csv|tsv)$/,
          use: [
            'csv-loader'
          ]
        },
        {
          test: /\.xml$/,
          use: [
            'xml-loader'
          ]
        },
        {
          test: /\.ejs/,
          loader: 'ejs-loader?variable=data'
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.less', '.css', '.json'], //后缀名自动补全
    }
  }
};