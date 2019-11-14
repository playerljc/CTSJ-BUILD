const startapp = require('./startapp');
const buildapp = require('./buildapp');
const buildumd = require('./buildumd');
const buildpackage = require('./buildpackage');

/**
 * 将用","分割的define参数转换成key/value的map
 * @param {String} - define
 * @return Array
 */
function getDefineMap(define = '') {
  return define.split(',');
}

module.exports = {
  startapp: {
    alias: 'start',
    description: 'run dev',
    options: [{
      command: '-c, --config <path>',
      description: 'ctbuild.config.js Configuration file path'
    }, {
      command: '-d, --define <path>',
      description: 'custom params split ","'
    }],
    action: (entry) => {
      console.log('startapp');
      const {config, define = ''} = entry;
      startapp.build({
        config,
        define: getDefineMap(define)
      });
    }
  },
  buildapp: {
    alias: 'build',
    description: 'build app',
    options: [{
      command: '-c, --config <path>',
      description: 'ctbuild.config.js Configuration file path'
    }, {
      command: '-d, --define <path>',
      description: 'custom params split ","'
    }],
    action: (entry) => {
      console.log('buildapp');
      // buildapp.build(entry.config, entry.define);
      const {config, define = ''} = entry;
      buildapp.build({
        config,
        define: getDefineMap(define)
      });
    }
  },
  buildumd: {
    alias: 'umd',
    description: 'build app by umd',
    options: [{
      command: '-c, --config <path>',
      description: 'ctbuild.config.js Configuration file path'
    }, {
      command: '-p, --packagename <name>',
      description: 'package name'
    }, {
      command: '-d, --define <path>',
      description: 'custom params split ","'
    }],
    action: (entry) => {
      console.log('buildumd');
      const {config, packagename, define = ''} = entry;
      buildumd.build({
        config,
        packagename,
        define: getDefineMap(define)
      });
    }
  },
  buildpackage: {
    alias: 'package',
    description: 'build package',
    options: [{
      command: '-p, --srcpath <path>',
      description: 'build path'
    }],
    action: (entry) => {
      console.log('buildpackage');
      buildpackage.build(entry.srcpath);
    }
  }
};