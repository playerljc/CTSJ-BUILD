# A packaging tool based on Webpack
 - Can build and dev for host projects based on React and Less (support typescript)
 - Can build npm package except Vue (support typescript)
 - Can compile umd except for Vue's npm package

# Install
```javascript
npm install @ctsj/build --save-dev
```

# Commands
- [startapp](#startapp)
- [buildapp](#buildapp)
- [buildpackage](#buildpackage)
- [buildpackagets](#buildpackagets)
- [buildumd](#buildumd)

### startapp
Start the host project in development mode
#### params：
- -c,--config <path>
##### The path of the configuration file (ctbuild.config.js) that the user redefines webpack. The default is the ctbuild.config.js file in the host project
```javascript
ctbuild startapp -c /opt/mydir/;
```
- -d,--define <path>
##### Other parameters are divided by
```javascript
ctbuild startapp --define skin=a,skin2=b
````

### buildapp
Start the host project in production mode
#### 参数：
- -c,--config <path>
##### The path of the configuration file (ctbuild.config.js) that the user redefines webpack. The default is the ctbuild.config.js file in the host project
```javascript
ctbuild startapp -c /opt/mydir/;
```
- -d,--define <path>
##### Other parameters are divided by
```javascript
ctbuild startapp --define skin=a,skin2=b
````

### buildpackage
Compile npm package
- -p,-srcpath <path>
##### It can be relative path and pair path, or not pass
```javascript
// If you don't pass -p, compile the src directory under the script running path
ctbuild buildpackage
```

```javascript
// If you pass an absolute path, compile this path
ctbuild buildpackage -p c:/x/xxx
```

```javascript
// If it is a relative path compile script running path + relative path
ctbuild buildpackage -p a/b/c
```

### buildpackagets
Compile npm package with ts
[Other same buildpackage](#buildpackage)

### buildumd
Compile npm package into umd
- -c,-config <path>
##### The path of the configuration file (ctbuild.config.js) that the user redefines webpack. The default is the ctbuild.config.js file in the host project

- -p,--packagename <name>
##### packagename of umd

- -d --define <path>
##### Use other custom parameters, split


## ctbuild.config.js
The function of this file is to allow users to redefine the already configured webpack configuration, as follows:
```javascript
// Need to export 2 methods
// 1.getTheme, return the global variable of less
// 2.getConfig parameter is an object, and the object has 4 properties
// webpack: the original webpack object
// webpackConfig: The configured webpack configuration object
// plugins: plugin collection
// define: custom parameters,
// We only need to customize the webpackConfig object
module.exports = {
  getTheme() {
    return modifyVars;
  },
  getConfig({ webpack,webpackConfig,plugins,define }) {
    
  },
};

```

### WebpackConfig configuration
```javascript
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
      filename: isProd() ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
      chunkFilename: isProd() ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
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
        filename: isDev() ? '[name].css' : '[name].[hash].css',
        chunkFilename: isDev() ? '[id].css' : '[id].[hash].css',
        ignoreOrder: false,
      }),
      new webpack.ProvidePlugin({
        _: 'lodash',
        $: 'jquery',
      }),
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.join(runtimePath, 'tsconfig.json'),
        checkSyntacticErrors: true,
      }),
      new WebpackBar({ reporters: ['profile'], profile: true }),
    ],
    optimization: isDev()
      ? {}
      : {
          minimize: !isDev(), // true,
          minimizer: isDev()
            ? []
            : [
                new TerserPlugin({
                  sourceMap: !isProd(),
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
                cacheDirectory: isProd(),
              },
            },
          ]),
        },
        {
          test: /\.m?tsx?$/,
          exclude: /(node_modules|bower_components)/,
          include: [APP_PATH],
          use: devLoaders.concat([
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                happyPackMode: true,
                configFile: path.join(runtimePath, 'tsconfig.json'),
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
            isDev()
              ? 'style-loader'
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: isDev(),
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
            isDev()
              ? 'style-loader'
              : {
                  loader: MiniCssExtractPlugin.loader,
                  options: {
                    hmr: isDev(),
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
````

### Default plugin list
 - HtmlWebpackPlugin,
 - MiniCssExtractPlugin,
 - CopyWebpackPlugin,
 - HtmlWebpackIncludeAssetsPlugin,
 
### startapp, the default custom parameters of buildapp
```javascript
ctbuild startapp --define alias=@,analysis,evnVars,cssModules,static=assets,curResolveModule
```
- alias=@src alias
- analysis whether to start analysis
- envVars Whether to inject env variables into the process
- cssModules=true whether to start cssModules
- static=assets static directory name is asstes by default
- curResolveModule whether the appointment to join the third-party package is searched from the node_modules of the host project
