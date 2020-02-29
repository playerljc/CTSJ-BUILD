const {spawn} = require('child_process');
const path = require('path');
// 运行脚本的路径
const runtimePath = process.cwd();
// 脚本所在的路径
const codePath = __dirname;
const commandPath = path.join(codePath, 'node_modules', '.bin', path.sep);

// buildpackage生成的目录名称
const generateDirName = 'lib';
// buildpackage原始名称
const srcDirName = 'src';

// 代码输出路径
const outputPath = path.join(runtimePath, generateDirName);

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
  gulpTask
];

/**
 * clearTask
 * 清除输出目录
 * @return {Promise}
 */
function clearTask() {
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? `${commandPath}rimraf.cmd` : `${commandPath}rimraf`;
    const rimrafProcess = spawn(command, [outputPath], {
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

/**
 * tscTask
 * 转换src到lib
 * @return {Promise}
 */
function tscTask() {
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? `${commandPath}tsc.cmd` : `${commandPath}tsc`;
    const tscProcess = spawn(
      command,
      [
        '-p',
        runtimePath,
      ],
      {
        cwd: codePath,
        encoding: 'utf-8',
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
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? `${commandPath}gulp.cmd` : `${commandPath}gulp`;
    const gulpProcess = spawn(
      command,
      [
        '--outputpath',
        // 输出路径
        path.join(outputPath, path.sep),
        '--compilepath',
        // 编译目录
        path.join(compilePath, path.sep)
      ],
      {
        cwd: codePath,
        encoding: 'utf-8',
      }
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
  /**
   * build
   * @param {String} - srcPath
   */
  build(srcPath) {
    if (srcPath) {
      // 指定了编译目录

      if (path.isAbsolute(srcPath)) {
        // 是绝对路径
        compilePath = srcPath;
      } else {
        // 是相对路径
        compilePath = path.join(runtimePath, srcPath);
      }
    } else {
      // 没有指定编译目录
      compilePath = path.join(runtimePath, srcDirName);
    }
    // console.log('buildpackage-srcPath----------------------', srcPath);

    loopTask().then(() => {
      console.log('finish');
      process.exit();
    }).catch((error) => {
      console.log(error);
    });
  }
};
