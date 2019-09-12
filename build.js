#!/usr/bin/env node

/**
 * --type [
 *          startapp - dev启动                   --- ctbuild.config.js
 *          buildapp - 打包                      --- ctbuild.config.js
 *          buildumd - 打包成umd包 src - umd     --- ctbuild.config.js
 *          buildpackage - 打包package src - lib
 *        ]
 * --config 配置文件的路径
 * --srcpath buildpackage的目录路径
 * --packagename 当--type为buildumd时 为包的名称
 */

// 处理命令行的工具
const commandArgs = require('./commandArgs');

const tasks = {
  // 用webpack开发
  startapp: require('./startapp'),
  // 用webpack打包app
  buildapp: require('./buildapp'),
  // 打包npm包
  buildpackage: require('./buildpackage'),
  // src打包成umd
  buildumd: require('./buildumd'),
};


/**
 * command args
 */
const argsMap = commandArgs.initCommandArgs();

/**
 * buildpackage
 * buildapp
 * buildumd
 * startapp
 */
const buildType = argsMap.get('--type') ? argsMap.get('--type')[0] : '';
// console.log(`参数${buildType}`);
if (tasks[buildType]) {
  tasks[buildType].build(argsMap);
}