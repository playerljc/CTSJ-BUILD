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
  getEnv(commandPath) {
    const obj = {};

    if (process.env && process.env.Path && process.env.Path.indexOf(commandPath) === -1) {
      obj.Path = process.env.Path + getEvnSplit() + commandPath;
    }

    if (process.env && process.env.PATH && process.env.PATH.indexOf(commandPath) === -1) {
      obj.PATH = process.env.PATH + getEvnSplit() + commandPath;
    }

    return Object.assign(process.env, obj);
  },
  /**
   * getPostCssConfigPath - 获取runtimePath下postcss.config.js文件路径
   * @param runtimePath
   * @return {string}
   */
  getPostCssConfigPath(runtimePath) {
    if (fs.existsSync(path.join(runtimePath, 'postcss.config.js'))) {
      return path.join(runtimePath, 'postcss.config.js');
    }
    return path.join(__dirname, 'postcss.config.js');
  },
  /**
   * getEntryIndex - 获取entry的index入口文件路径
   */
  getEntryIndex(runtimePath) {
    const extensionNames = ['.js', '.jsx', '.tsx'];
    let index = -1;
    for (let i = 0; i < extensionNames.length; i++) {
      const extensionName = extensionNames[i];
      const exists = fs.existsSync(path.join(runtimePath, 'src', `index${extensionName}`));
      if (exists) {
        index = i;
        break;
      }
    }

    const entryIndexName = index !== -1 ? `index${extensionNames[index]}` : 'index.js';
    return path.join(runtimePath, 'src', entryIndexName);
  },
};
