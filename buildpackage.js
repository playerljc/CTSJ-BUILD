const {spawn} = require('child_process');
const path = require('path');
// 运行脚本的路径
const runtimePath = process.cwd();
// 脚本所在的路径
const codePath = __dirname;
const commandPath = path.join(codePath, 'node_modules', '.bin', '/');

// buildpackage生成的目录名称
const generateDirName = 'lib';
// buildpackage原始名称
const srcDirName = 'src';

let srcPath;
let argsMap;

let index = 0;
// buildpackage的所有任务
const tasks = [
  // 清除生成目录
  clearTask,
  // babel转换，转换js
  babelTask,
  // 样式
  gulpTask
];

/**
 * clearTask
 * 清除lib目录
 * @return {Promise}
 */
function clearTask() {
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? `${commandPath}rimraf.cmd` : `${commandPath}rimraf`;
    const rimrafProcess = spawn(command, [path.join(runtimePath, generateDirName)], {
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
 * babelTask
 * 转换src到lib
 * @return {Promise}
 */
function babelTask() {
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? `${commandPath}babel.cmd` : `${commandPath}babel`;
    const babelProcess = spawn(
      command,
      [
        path.join(srcPath, srcDirName),
        '-d',
        path.join(runtimePath, generateDirName),
        '--ignore',
        '__tests__'
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
  return new Promise((resolve, reject) => {
    const command = process.platform === "win32" ? `${commandPath}gulp.cmd` : `${commandPath}gulp`;
    const gulpProcess = spawn(
      command,
      [
        '--runtimepath',
        path.join(runtimePath, '/'),
        '--srcpath',
        path.join(srcPath, '/')
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
   * @param args
   */
  build(args) {
    argsMap = args;
    let srcpatharg = args.get('--srcpath');
    if (srcpatharg && Array.isArray(srcpatharg)) {
      srcpatharg = srcpatharg[0];
    }
    console.log('srcpatharg', srcpatharg);
    if (srcpatharg === '../') {
      srcPath = runtimePath.substring(0, runtimePath.lastIndexOf(path.join('/')));
    } else {
      srcPath = runtimePath;
    }
    console.log('buildpackage-srcPath----------------------', srcPath);

    loopTask().then(() => {
      console.log('finish');
      process.exit();
    }).catch((error) => {
      console.log(error);
    });
  }
};