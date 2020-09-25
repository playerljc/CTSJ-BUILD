#!/usr/bin/env node
const path = require('path');
const { spawn } = require('child_process');
// 运行命令的路径
const runtimePath = process.cwd();
// build.js所在的路径
const codePath = __dirname;
// ctbuild.cmd或者ctbuild.sh所在路径
const commandPath = path.join(codePath, 'node_modules', '.bin', path.sep);
const { getEnv } = require('./util');
// 配置文件所在路径
let configPath;
let define;

/**
 * corssenvTask
 * @return {Promise}
 */
function corssenvTask() {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32' ? `cross-env.cmd` : `cross-env`;
    const crossenvProcess = spawn(command, ['REAP_PATH=prod', 'NODE_ENV=production'], {
      cwd: codePath,
      encoding: 'utf-8',
      env: getEnv(commandPath),
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

// /**
//  * prodDllTask
//  * @return {Promise}
//  */
// function prodDllTask() {
//   return new Promise((resolve, reject) => {
//     const command = process.platform === "win32" ? `${commandPath}webpack.cmd` : `${commandPath}webpack`;
//     const devDllProcess = spawn(
//       command,
//       [
//         '--config',
//         path.join('webpackconfig', 'webpack.prod.dll.js'),//'webpackconfig/webpack.prod.dll.js',
//         '--custom',
//         path.join(runtimePath, path.sep),//`${runtimePath}\\`
//       ],
//       {
//         cwd: codePath,
//         encoding: 'utf-8',
//       }
//     );
//
//     devDllProcess.stdout.on('data', (data) => {
//       console.log(`stdout: ${data}`);
//     });
//
//     devDllProcess.stderr.on('data', (data) => {
//       console.log(`stderr: ${data}`);
//     });
//
//     devDllProcess.on('close', (code) => {
//       console.log(`prodDllTaskClose：${code}`);
//       resolve();
//     });
//   });
// }

/**
 * webpackTask
 * @return {Promise}
 */
function webpackTask() {
  return new Promise((resolve, reject) => {
    const command = process.platform === 'win32' ? `webpack.cmd` : `webpack`;
    const babelProcess = spawn(
      command,
      [
        '--open',
        '--config',
        path.join('webpackconfig', 'webpack.prod.js'),
        '--progress',
        '--colors',
        '--runtimepath',
        path.join(runtimePath, path.sep),
        '--customconfig',
        configPath,
        '--define',
        define.join(' '),
        // '--profile',
        // '--json',
        // '>',
        // path.join(runtimePath,'stats.json'),
      ],
      {
        cwd: codePath,
        encoding: 'utf-8',
        env: getEnv(commandPath),
      },
    );

    // console.log('-----------env-start-----------');
    // console.log(process.env);
    // console.log('-----------env-end-------------');

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

const tasks = [corssenvTask, /* prodDllTask, */ webpackTask];
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
        task()
          .then(() => {
            loopTask().then(() => {
              resolve();
            });
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject();
      }
    }
  });
}

module.exports = {
  /**
   * build
   * @param {String} - ctbuildConfigPath
   * ctbuild.config.js配置文件的路径，如果没有指定则会寻找命令运行目录下的ctbuild.config.js文件
   */
  build: ({ config: ctbuildConfigPath = '', define: defineMap }) => {
    if (ctbuildConfigPath) {
      if (path.isAbsolute(ctbuildConfigPath)) {
        configPath = ctbuildConfigPath;
      } else {
        configPath = path.join(runtimePath, ctbuildConfigPath);
      }
    } else {
      configPath = path.join(runtimePath, 'ctbuild.config.js');
    }

    define = defineMap;

    loopTask()
      .then(() => {
        console.log('finish');
        process.exit();
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
