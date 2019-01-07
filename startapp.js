#!/usr/bin/env node

const {spawn} = require('child_process');
// 运行命令的路径
const runtimePath = process.cwd();
// 命令的路径
const codePath = __dirname;
// 命令所在路径
const commandPath = `${codePath}\\node_modules\\.bin\\`;
let argsMap;

/**
 * corssenvTask
 * @access private
 * @return {Promise}
 */
function corssenvTask() {
  return new Promise((resolve, reject) => {
    const crossenvProcess = spawn(process.platform === "win32" ? `${commandPath}cross-env.cmd` : `${commandPath}cross-env`, ['REAP_PATH=dev', 'NODE_ENV=development'], {
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
 * devDllTask
 * @return {Promise}
 */
function devDllTask() {
  return new Promise((resolve, reject) => {
    const devDllProcess = spawn(process.platform === "win32" ? `${commandPath}webpack.cmd` : `${commandPath}webpack`, ['--config', 'webpackconfig/webpack.dev.dll.js', '--custom', `${runtimePath}\\`], {
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
      console.log(`devDllTaskClose：${code}`);
      resolve();
    });
  });
}

/**
 * webpackServiceTask
 * @return {Promise}
 */
function webpackServiceTask() {
  return new Promise((resolve, reject) => {
    const babelProcess = spawn(process.platform === "win32" ? `${commandPath}webpack-dev-server.cmd` : `${commandPath}webpack-dev-server`,
      [
        '--open',
        '--config',
        'webpackconfig/webpack.dev.js',
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
      console.log(`webpackServiceTaskClose：${code}`);
      resolve();
    });
  });
}

const tasks = [corssenvTask, devDllTask, webpackServiceTask];
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