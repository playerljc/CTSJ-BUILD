/**
 * 工程的evn变量
 * @param curModule
 */
module.exports = function ({ curModule, webpack }) {
  const keys = Object.getOwnPropertyNames(process.env);
  const evnVars = {};
  keys.forEach((key) => (evnVars[key] = JSON.stringify(process.env[key])));
  curModule.plugins.push(
    new webpack.DefinePlugin({
      evnVars,
    }),
  );
};
