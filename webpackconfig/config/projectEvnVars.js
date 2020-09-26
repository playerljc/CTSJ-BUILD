/**
 * 工程的evn变量
 * @param curModule
 */
module.exports = function ({ webpackConfig, webpack }) {
  const keys = Object.getOwnPropertyNames(process.env);
  const evnVars = {};
  keys.forEach((key) => (evnVars[key] = JSON.stringify(process.env[key])));
  webpackConfig.plugins.push(
    new webpack.DefinePlugin({
      evnVars,
    }),
  );
};
