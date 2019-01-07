#!/usr/bin/env node

// 处理命令行的工具
const commandArgs = require('./commandArgs');

/***
 * 根据--type指定的类型执行任务
 * @type {{buildapp: *, buildpackage: *, startapp: *}}
 */
const tasks = {
  // 用webpack打包app
  buildapp: require('./buildapp'),
  // 打包npm包
  buildpackage: require('./buildpackage'),
  // 用webpack开发
  startapp: require('./startapp')
};


/**
 * command args
 */
const argsMap = commandArgs.initCommandArgs();

/**
 * buildpackage
 * buildapp
 * startapp
 */
const buildType = argsMap.get('--type') ? argsMap.get('--type')[0] : '';
console.log(`参数${buildType}`);
if (tasks[buildType]) {
  tasks[buildType].build(argsMap);
}