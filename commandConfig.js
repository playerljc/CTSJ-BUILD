const startapp = require('./startapp');
const buildapp = require('./buildapp');
const buildumd = require('./buildumd');
const buildpackage = require('./buildpackage');

module.exports = {
  startapp: {
    alias: 'start',
    description: 'run dev',
    options: [{
      command: '-c, --config <path>',
      description: 'ctbuild.config.js Configuration file path'
    }],
    action: (entry) => {
      console.log('startapp', entry.config);
      startapp.build(entry.config);
    }
  },
  buildapp: {
    alias: 'build',
    description: 'build app',
    options: [{
      command: '-c, --config <path>',
      description: 'ctbuild.config.js Configuration file path'
    }],
    action: (entry) => {
      console.log('buildapp');
      buildapp.build(entry.config);
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
    }],
    action: (entry) => {
      console.log('buildumd');
      const {config, packagename} = entry;
      buildumd.build({config, packagename});
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