#!/usr/bin/env node

const {spawn} = require('child_process');
const args = require('./commandArgs');

// 运行脚本的路径
const runtimePath = process.cwd();

// 脚本的路径
const codePath = __dirname;
const commandPath = `${codePath}\\node_modules\\.bin\\`;

const tasks = [cpTask];
let index = 0;

/**
 * cpTask
 * @return {Promise}
 */
function cpTask() {
  return new Promise((resolve, reject) => {
    const cpProcess = spawn(
      process.platform === "win32" ? `${commandPath}cp-cli.cmd` : `${commandPath}cp-cli`,
      args.getArgs(),
      {
        cwd: runtimePath,
        encoding: 'utf-8',
      });

    cpProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    cpProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    cpProcess.on('close', (code) => {
      console.log(`cpClose：${code}`);
      resolve();
    });
  });
}

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

loopTask().then(() => {
  console.log('finish');
  process.exit();
}).catch((error) => {
  console.log(error);
});