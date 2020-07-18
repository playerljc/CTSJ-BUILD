const fs = require('fs');
const path = require('path');

function getEvnSplit() {
  return process.platform === 'win32' ? ';' : ':';
}

module.exports = {
  /**
   * 获取env
   * @param commandPath
   */
  getEnv (commandPath) {
    const obj = {};

    if (process.env && process.env.Path && process.env.Path.indexOf(commandPath) === -1) {
      obj.Path = process.env.Path + getEvnSplit() + commandPath;
    }

    if (process.env && process.env.PATH && process.env.PATH.indexOf(commandPath) === -1) {
      obj.PATH = process.env.PATH + getEvnSplit() + commandPath;
    }

    return Object.assign(process.env, obj);
  },
  getPostCssConfigPath(runtimePath) {
    if (fs.existsSync(path.join(runtimePath, 'postcss.config.js'))) {
      return path.join(runtimePath, 'postcss.config.js');
    } 
      return path.join(__dirname, 'postcss.config.js');
    
  },
};
