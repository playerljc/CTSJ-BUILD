## CTSJ-BUILD

## A webpack packaging tool

- **.ctbuild**
  - [**.startapp**](#startapp)
  - [**.buildapp**](#buildapp)
  - [**.buildumd**](#buildumd)
  - [**.buildpackage**](#buildpackage)
  - [**.buildpackagets**](#buildpackage)
  - [**.ctbuild.config.js**](#config)
  - [**.Default setting**](#defaultsetting)
- [**.ctcopy**](#ctcopy)

** .startapp **

Developed form of operation

Options:

- -c, --config <path> ctbuild.config.js configuration file location, if not specified, read ctbuild.config.js in the directory where the command is located
- -d, --define <path> custom params split ","

** .buildapp **

Production environment packaging

Options:

- -c, --config <path> ctbuild.config.js configuration file location, if not specified, read ctbuild.config.js in the directory where the command is located
- -d, --define <path> custom params split ","

** .buildumd **

Production environment umd package

Options:

- -c, --config <path> ctbuild.config.js configuration file location, if not specified, read ctbuild.config.js in the directory where the command is located
- -p, --packagename <name> package name,The prefix name of the js file after packaging, If not specified, it is packagename
- -d, --define <path> custom params split ","

** .buildpackage **

Packaged into npm package

Options:

- -p, --srcpath <path> Packaged directory, if not specified, is the src folder under the running directory

** .buildpackagets **

Packaged into npm package use typescript

Options:

- -p, --srcpath <path> Packaged directory, if not specified, is the src folder under the running directory

** .ctbuild.config.js **

Webpack configuration file, use default configuration if no configuration is possible

code

```js
module.exports = {
  getConfig({ webpack, curModule, plugins }) {},
};
```

- webpack Webpack native object
- curModule Default configuration object
- plugins Default webpack plugin set These plugins include：
  - HtmlWebpackPlugin
  - MiniCssExtractPlugin
  - CopyWebpackPlugin
  - HtmlWebpackIncludeAssetsPlugin
  - LessPluginCleanCSS
  - LessPluginAutoPrefix

.The user can perform a merge operation on the curModule, all operations are webpack configuration items, and finally return，Note that if you use webpack objects and plugins, you need to use the values provided by the webpack and plugins provided in the parameters.

** .defaultSetting **

- js/jsx parsing

- ts/tsx parsing
- css/less parsing
- css/less packaged into a file
- Image Resolution
- Font parsing
- HappyPack Multicore Compilation
- cache-loader
- extensions autocomplete
- The splitChunks of node_modules is a vendor
