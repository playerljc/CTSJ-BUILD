#!/usr/bin/env node
const path = require('path');
const {spawn} = require('child_process');
// 运行命令的路径
const runtimePath = process.cwd();
// 命令的路径
const codePath = __dirname;
// 命令所在路径
const commandPath = path.join(codePath, 'node_modules', '.bin', '/');
//`${codePath}\\node_modules\\.bin\\`;
let argsMap;

/**
 * corssenvTask
 * @access private
 * @return {Promise}
 */
function corssenvTask() {
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? `${commandPath}cross-env.cmd` : `${commandPath}cross-env`;
    const crossenvProcess = spawn(command, ['REAP_PATH=dev', 'NODE_ENV=development'], {
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
    const command = process.platform === "win32" ? `${commandPath}webpack.cmd` : `${commandPath}webpack`;
    const devDllProcess = spawn(
      command,
      [
        '--config',
        path.join('webpackconfig', 'webpack.dev.dll.js'),//'webpackconfig/webpack.dev.dll.js',
        '--custom',
        path.join(runtimePath, '/'),//`${runtimePath}\\`
      ],
      {
        cwd: codePath,
        encoding: 'utf-8',
      }
    );

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
    const command = process.platform === "win32" ? `${commandPath}webpack-dev-server.cmd` : `${commandPath}webpack-dev-server`;
    const babelProcess = spawn(
      command,
      [
        '--open',
        '--config',
        path.join('webpackconfig', 'webpack.dev.js'),//'webpackconfig/webpack.dev.js',
        '--runtimepath',
        path.join(runtimePath, '/'),//`${runtimePath}\\`,
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

// startapp的tasks
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