#!/usr/bin/env node

const path = require('path');
const { spawn } = require('child_process');
const logger = require('npmlog');
const { getEnv, isWin32 } = require('./util');

// 运行命令的路径
const runtimePath = process.cwd();

// 运行命令的路径去掉/
const srcPath = runtimePath.substring(0, runtimePath.lastIndexOf(path.sep));

// build.js所在的路径
const codePath = __dirname;

// ctbuild.cmd或者ctbuild.sh所在路径
const commandPath = path.join(codePath, '../', 'node_modules', '.bin', path.sep);

// 配置文件所在路径
let configPath;

// [packageName].bundle.js
// [packageName].css
let packageName;

let define;

const tasks = [copySrcTask, /* corssenvTask, */ webpackTask /* , removeSrcTask */];

let index = 0;

/**
 * 复制src到runtimePath
 */
function copySrcTask() {
  return new Promise((resolve) => {
    const commands = {
      win32: {
        command: 'xcopy',
        params: [path.join(srcPath, 'src'), path.join(runtimePath, 'src'), '/e', '/i', '/y'],
      },
      linux: {
        command: 'cp',
        params: ['-r', '-f', path.join(srcPath, 'src'), path.join(runtimePath, 'src')],
      },
    };

    const { command, params } = isWin32() ? commands.win32 : commands.linux;

    const copyProcess = spawn(command, params, {
      cwd: path.join(codePath, '../'),
      encoding: 'utf-8',
      env: getEnv(commandPath),
    });

    copyProcess.stdout.on('data', (data) => {
      logger.info(`${data}`);
    });

    copyProcess.stdin.on('data', (data) => {
      logger.info(`${data}`);
    });

    copyProcess.stderr.on('data', (data) => {
      logger.warn(`${data}`);
    });

    copyProcess.on('close', () => {
      resolve();
    });
  });
}

// /**
//  * corssenvTask
//  * @return {Promise}
//  */
// function corssenvTask() {
//   return new Promise((resolve) => {
//     const command = isWin32() ? `cross-env.cmd` : `cross-env`;
//     const crossenvProcess = spawn(command, ['REAP_PATH=prod', 'NODE_ENV=production'], {
//       cwd: codePath,
//       encoding: 'utf-8',
//       env: getEnv(commandPath),
//     });
//
//     crossenvProcess.stdout.on('data', (data) => {
//       logger.info(`stdout: ${data}`);
//     });
//
//     crossenvProcess.stderr.on('data', (data) => {
//       logger.info(`stderr: ${data}`);
//     });
//
//     crossenvProcess.on('close', (code) => {
//       logger.info(`crossenvClose：${code}`);
//       resolve();
//     });
//   });
// }

/**
 * webpackTask
 * @return {Promise}
 */
function webpackTask() {
  return new Promise((resolve) => {
    const command = isWin32() ? `webpack.cmd` : `webpack`;

    const babelProcess = spawn(
      command,
      [
        '--config',
        path.join(codePath, 'webpackconfig', 'webpack.umd.js'),
        '--progress',
        '--env',
        [
          `runtimepath=${path.join(runtimePath, path.sep)}`,
          `customconfig=${configPath}`,
          `packagename=${packageName}`,
          `define=${Buffer.from(JSON.stringify(define)).toString('base64')}`,
        ].join(' '),
      ],
      {
        cwd: path.join(codePath, '../'),
        encoding: 'utf-8',
        env: getEnv(commandPath),
      },
    );

    babelProcess.stdout.on('data', (data) => {
      logger.info(`${data}`);
    });

    babelProcess.stdin.on('data', (data) => {
      logger.info(`${data}`);
    });

    babelProcess.stderr.on('data', (data) => {
      logger.warn(`${data}`);
    });

    babelProcess.on('close', () => {
      resolve();
    });
  });
}

// /**
//  * 从runtimePath中删除src
//  */
// function removeSrcTask() {
//   return new Promise((resolve, reject) => {
//     const rimrafProcess = spawn(process.platform === "win32" ? `${commandPath}rimraf.cmd` : `${commandPath}rimraf`, [`${runtimePath}\\src`], {
//       cwd: codePath,
//       encoding: 'utf-8',
//     });
//
//     rimrafProcess.stdout.on('data', (data) => {
//       logger.info(`stdout: ${data}`);
//     });
//
//     rimrafProcess.stderr.on('data', (data) => {
//       logger.info(`stderr: ${data}`);
//     });
//
//     rimrafProcess.on('close', (code) => {
//       logger.info(`rimrafClose：${code}`);
//       resolve();
//     });
//   });
// }

/**
 * loopTask
 * @return {Promise}
 */
function loopTask() {
  return new Promise((resolve, reject) => {
    if (index >= tasks.length) {
      resolve();
    } else {
      // eslint-disable-next-line no-plusplus
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
  build: ({ config: ctbuildConfigPath = '', packagename = 'packagename', define: defineMap }) => {
    if (ctbuildConfigPath) {
      if (path.isAbsolute(ctbuildConfigPath)) {
        configPath = ctbuildConfigPath;
      } else {
        configPath = path.join(runtimePath, ctbuildConfigPath);
      }
    } else {
      configPath = path.join(runtimePath, 'ctbuild.config.js');
    }

    packageName = packagename;

    define = defineMap;

    loopTask()
      .then(() => {
        logger.info('finish');
        process.exit();
      })
      .catch((error) => {
        logger.error(error);
      });
  },
};
