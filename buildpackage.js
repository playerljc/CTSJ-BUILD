#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const { getEnv, isWin32 } = require('./util');

// 运行脚本的路径
const runtimePath = process.cwd();

// 脚本所在的路径
const codePath = __dirname;

const commandPath = path.join(codePath, 'node_modules', '.bin', path.sep);

// buildpackage生成的目录名称
const generateDirName = 'lib';

// buildpackage原始名称
const srcDirName = 'src';

// 代码编译路径
let compilePath;

// 代码输出路径
let outputPath;

// 配置文件路径
let configPath;

let index = 0;

// buildpackage的所有任务
const tasks = [
  // 清除生成目录
  clearTask,
  // babel转换，转换js
  babelTask,
  // 样式
  gulpTask,
];

/**
 * clearTask
 * 清除输出目录
 * @return {Promise}
 */
function clearTask() {
  return new Promise((resolve) => {
    const command = isWin32() ? `rimraf.cmd` : `rimraf`;

    const rimrafProcess = spawn(command, [outputPath], {
      cwd: codePath,
      encoding: 'utf-8',
      env: getEnv(commandPath),
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

/**
 * babelTask
 * 转换src到lib
 * @return {Promise}
 */
function babelTask() {
  return new Promise((resolve) => {
    const command = isWin32() ? `cross-env.cmd` : `cross-env`;

    const babelProcess = spawn(
      command,
      [
        `runtimePath=${runtimePath}`,
        `configPath=${configPath}`,
        'babel',
        // 编译的目录
        compilePath,
        '-d',
        // 输出的目录
        outputPath,
        '--minified',
        '-s',
        'true',
        '--no-comments',
      ],
      {
        cwd: codePath,
        encoding: 'utf-8',
        env: getEnv(commandPath),
      },
    );

    babelProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    babelProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    babelProcess.on('close', (code) => {
      console.log(`babelClose：${code}`);
      resolve();
    });
  });
}

/**
 * gulpTask
 * @return {Promise}
 */
function gulpTask() {
  return new Promise((resolve) => {
    const command = isWin32() ? `gulp.cmd` : `gulp`;

    const gulpProcess = spawn(
      command,
      [
        '--outputpath',
        // 输出路径
        path.join(outputPath, path.sep),
        '--compilepath',
        // 编译目录
        path.join(compilePath, path.sep),
      ],
      {
        cwd: codePath,
        encoding: 'utf-8',
        env: getEnv(commandPath),
      },
    );

    gulpProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    gulpProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    gulpProcess.on('close', (code) => {
      console.log(`gulpTaskClose：${code}`);
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
  /**
   * build
   * @param {String} - config - 配置文件
   * @param {String} - srcpath - 编译目录
   * @param {String} - output - 代码输出目录
   */
  build({ config, srcpath, output }) {
    // 指定了编译目录
    if (srcpath) {
      // 是绝对路径
      if (path.isAbsolute(srcpath)) {
        compilePath = srcpath;
      }
      // 是相对路径(程序运行目录/srcPath)
      else {
        compilePath = path.join(runtimePath, srcpath);
      }
    }
    // 没有指定编译目录
    else {
      // (程序运行目录/src)
      compilePath = path.join(runtimePath, srcDirName);
    }

    // 指定了输出目录
    if (output) {
      // 是绝对路径
      if (path.isAbsolute(output)) {
        outputPath = output;
      }
      // 是相对路径(程序运行目录/srcPath)
      else {
        outputPath = path.join(runtimePath, output);
      }
    }
    // 没有指定输出目录
    else {
      // (程序运行目录/src)
      outputPath = path.join(runtimePath, generateDirName);
    }

    // 指定了配置文件目录
    if (config) {
      // 是绝对路径
      if (path.isAbsolute(config)) {
        configPath = config;
      }
      // 是相对路径(程序运行目录/srcPath)
      else {
        configPath = path.join(runtimePath, config);
      }
    }
    // 没有指定配置文件目录
    else {
      // (程序运行目录/ctbuild.package.config.js)
      configPath = path.join(runtimePath, 'ctbuild.package.config.js');
    }

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
