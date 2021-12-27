const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');
const { getEnv, isWin32 } = require('./util');

// 运行脚本的路径
const runtimePath = process.cwd();

// 脚本所在的路径
const codePath = __dirname;

const commandPath = path.join(codePath, 'node_modules', '.bin', path.sep);

// buildpackage生成的目录名称
let generateDirName = 'lib';

// buildpackage原始名称
const srcDirName = 'src';

// p参数
let p;
// tsP的实际路径
let pTarget;

// 代码输出路径
let outputPath;

// 代码编译路径
let compilePath;

let index = 0;

// buildpackage的所有任务
const tasks = [
  // 清除生成目录
  clearTask,
  // tsc转换，转换typescript
  tscTask,
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
 * tscTask
 * 转换src到lib
 * @return {Promise}
 */
function tscTask() {
  return new Promise((resolve) => {
    const command = isWin32() ? `tsc.cmd` : `tsc`;

    const tscProcess = spawn(command, ['-p', pTarget], {
      cwd: codePath,
      encoding: 'utf-8',
      env: getEnv(commandPath),
    });

    tscProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    tscProcess.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    tscProcess.on('close', (code) => {
      console.log(`tscClose：${code}`);
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

    console.log('compilePath', compilePath);
    console.log('outputpath', outputPath);

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
   * @param {String} - srcPath
   */
  build({ srcpath, output = 'lib' }) {
    p = srcpath;
    generateDirName = output;
    outputPath = path.join(runtimePath, generateDirName);

    // 输入了p参数
    if (p) {
      // 文件描述符
      const stat = fs.statSync(p);

      // 绝对路径
      if (path.isAbsolute(p)) {
        // 是文件
        if (stat.isFile()) {
          // ts
          pTarget = p;
          // gulp
          compilePath = path.join(runtimePath, srcDirName);
        }
        // 是目录
        else {
          // ts
          pTarget = p;
          // gulp
          compilePath = path.join(p, srcDirName);
        }
      }
      // 相对路径
      else {
        // 是文件
        if (stat.isFile()) {
          // ts
          pTarget = path.join(runtimePath, p);
          // gulp
          compilePath = path.join(runtimePath, srcDirName);
        }
        // 是目录
        else {
          // ts
          pTarget = path.join(runtimePath, p);
          // gulp
          compilePath = path.join(runtimePath, p, srcDirName);
        }
      }
    }
    // 没输入p参数
    else {
      // ts
      pTarget = runtimePath;
      // gulp
      compilePath = path.join(runtimePath, srcDirName);
    }
    // console.log('buildpackage-p----------------------', p);

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
