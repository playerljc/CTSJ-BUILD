const startapp = require('./startapp');
const buildapp = require('./buildapp');
const buildumd = require('./buildumd');
const buildpackage = require('./buildpackage');
const buildpackagets = require('./buildpackagets');

/**
 * 将用","分割的define参数转换成key/value的map
 * @return Array
 * @param define
 */
function getDefineMap(define = '') {
  return define.split(',');
}

module.exports = {
  // dev环境
  startapp: {
    alias: 'start',
    description: 'run dev',
    options: [
      {
        command: '-c, --config <path>',
        description: 'ctbuild.config.js Configuration file path',
      },
      {
        command: '-d, --define <path>',
        description: 'custom params split ","',
      },
    ],
    action: (entry) => {
      console.log('startapp');
      const { config, define = '' } = entry;
      startapp.build({
        config,
        define: getDefineMap(define),
      });
    },
  },
  // 打包生产环境
  buildapp: {
    alias: 'build',
    description: 'build app',
    options: [
      {
        command: '-c, --config <path>',
        description: 'ctbuild.config.js Configuration file path',
      },
      {
        command: '-d, --define <path>',
        description: 'custom params split ","',
      },
    ],
    action: (entry) => {
      console.log('buildapp');
      // buildapp.build(entry.config, entry.define);
      const { config, define = '' } = entry;
      buildapp.build({
        config,
        define: getDefineMap(define),
      });
    },
  },
  // 打包生成环境的umd
  buildumd: {
    alias: 'umd',
    description: 'build app by umd',
    options: [
      {
        command: '-c, --config <path>',
        description: 'ctbuild.config.js Configuration file path',
      },
      {
        command: '-p, --packagename <name>',
        description: 'package name',
      },
      {
        command: '-d, --define <path>',
        description: 'custom params split ","',
      },
    ],
    action: (entry) => {
      console.log('buildumd');
      const { config, packagename, define = '' } = entry;
      buildumd.build({
        config,
        packagename,
        define: getDefineMap(define),
      });
    },
  },
  // 编译package
  buildpackage: {
    alias: 'package',
    description: 'build package',
    options: [
      {
        command: '-p, --srcpath <path>',
        description: 'build path',
      },
    ],
    action: (entry) => {
      console.log('buildpackage');
      buildpackage.build(entry.srcpath);
    },
  },
  // 编译package的ts版本
  buildpackagets: {
    alias: 'packagets',
    description: 'build packagets',
    options: [
      {
        command: '-p, --srcpath <path>',
        description: 'build path',
      },
      {
        command: '-o, --output <path>',
        description: 'output path',
      },
    ],
    action: (entry) => {
      console.log('buildpackagets');
      buildpackagets.build(entry);
    },
  },
};
