#!/usr/bin/env node

const {spawn} = require('child_process');
const runtimePath = process.cwd();
const codePath = __dirname;
const commandPath = `${codePath}\\node_modules\\.bin\\`;
let argsMap;

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
 * prodDllTask
 * @return {Promise}
 */
function prodDllTask() {
  return new Promise((resolve, reject) => {
    const devDllProcess = spawn(process.platform === "win32" ? `${commandPath}webpack.cmd` : `${commandPath}webpack`, ['--config', 'webpackconfig/webpack.prod.dll.js', '--custom', `${runtimePath}\\`], {
      cwd: codePath,
      encoding: 'utf-8',
    });

    devDllProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    devDllProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    devDllProcess.on('close', (code) => {
      console.log(`prodDllTaskClose：${code}`);
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
        'webpackconfig/webpack.prod.js',
        '--runtimepath',
        `${runtimePath}\\`,
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

const tasks = [corssenvTask, prodDllTask, webpackTask];
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