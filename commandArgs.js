module.exports = {
  /**
   * 初始化命令行参数
   * --type 构建类型
   * --config 另外的配置文件
   * @return {Map}
   */
  initCommandArgs() {
    const map = new Map();
    const customArgs = process.argv.slice(2);
    let preArg;
    for (let i = 0; i < customArgs.length; i++) {
      const arg = customArgs[i];
      if (arg.startsWith('--')) {
        map.set(arg, []);
        preArg = arg;
      }
      else {
        const value = map.get(preArg);
        if (value) {
          value.push(arg);
        }
      }
    }
    return map;
  }
};