#!/usr/bin/env node

const {spawn} = require('child_process');
const runtimePath = process.cwd();
const srcPath = runtimePath.substring(0, runtimePath.lastIndexOf('\\'));
const codePath = __dirname;
const commandPath = `${codePath}\\node_modules\\.bin\\`;
let argsMap;

/**
 * 复制src到runtimePath
 */
function copySrcTask() {
  return new Promise((resolve, reject) => {
    const commands = {
      'win32': {
        command: 'xcopy',
        params: [`${srcPath}\\src`, `${runtimePath}\\src`, '/e', '/i', '/y']
      },
      'linux': {
        command: 'cp',
        params: ['-r','-f',`${srcPath}\\src`, `${runtimePath}\\src`]
      }
    };

    console.log('process.platform', process.platform);
    const {command, params} = process.platform === "win32" ? commands['win32'] : commands['linux'];

    const copyProcess = spawn(
      command, params, {
        cwd: codePath,
        encoding: 'utf-8',
      });

    copyProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    copyProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    copyProcess.on('close', (code) => {
      console.log(`crossenvClose：${code}`);
      resolve();
    });
  });
}

/**
 * corssenvTask
 * @return {Promise}
 */
function corssenvTask() {
  return new Promise((resolve, reject) => {
    const crossenvProcess = spawn(process.platform === "win32" ? `${commandPath}cross-env.cmd` : `${commandPath}cross-env`, ['REAP_PATH=prod', 'NODE_ENV=production'], {
      cwd: codePath,
      encoding: 'utf-8',
    });

    crossenvProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    crossenvProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    crossenvProcess.on('close', (code) => {
      console.log(`crossenvClose：${code}`);
      resolve();
    });
  });
}

/**
 * webpackTask
 * @return {Promise}
 */
function webpackTask() {
  return new Promise((resolve, reject) => {
    const babelProcess = spawn(process.platform === "win32" ? `${commandPath}webpack.cmd` : `${commandPath}webpack`,
      [
        '--open',
        '--config',
        'webpackconfig/webpack.umd.js',
        '--runtimepath',
        `${runtimePath}\\`,
        '--packagename',
        `${argsMap.get('--packagename')}`,
        '--customconfig',
        argsMap.get('--config')
      ],
      {
        cwd: codePath,
        encoding: 'utf-8',
      });

    babelProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    babelProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    babelProcess.on('close', (code) => {
      console.log(`webpackTaskClose：${code}`);
      resolve();
    });
  });
}

/**
 * 从runtimePath中删除src
 */
function removeSrcTask() {
  return new Promise((resolve, reject) => {
    const rimrafProcess = spawn(process.platform === "win32" ? `${commandPath}rimraf.cmd` : `${commandPath}rimraf`, [`${runtimePath}\\src`], {
      cwd: codePath,
      encoding: 'utf-8',
    });

    rimrafProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    rimrafProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    rimrafProcess.on('close', (code) => {
      console.log(`rimrafClose：${code}`);
      resolve();
    });
  });
}

const tasks = [copySrcTask, corssenvTask, webpackTask, removeSrcTask];
let index = 0;

/**
 * loopTask
 * @return {Promise}
 */
function loopTask() {
  return new Promise((resolve, reject) => {
    if (index >= tasks.length) {
      resolve();
    } else {
      const task = tasks[index++];
      if (task) {
        task().then(() => {
          loopTask().then(() => {
            resolve();
          });
        }).catch((error) => {
          reject(error);
        });
      } else {
        reject();
      }
    }
  });

}

module.exports = {
  build: (args) => {
    argsMap = args;
    loopTask().then(() => {
      console.log('finish');
      process.exit();
    }).catch((error) => {
      console.log(error);
    });
  }
};