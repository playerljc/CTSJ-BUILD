module.exports = {
  /**
   * 获取env
   * @param commandPath
   */
  getEnv: function(commandPath) {
    return Object.assign(process.env, {
      dp0: process.env.dp0 + ';' + commandPath,
      Path: process.env.Path + ';' + commandPath,
    });
  }
};
