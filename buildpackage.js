const {spawn} = require('child_process');
// 运行脚本的路径
const runtimePath = process.cwd();
console.log('buildpackage-runtimePath----------------------', runtimePath);
// 脚本的路径
const codePath = __dirname;
const commandPath = `${codePath}\\node_modules\\.bin\\`;

let srcPath;
let argsMap;

const tasks = [clearTask, babelTask, gulpTask];
let index = 0;

/**
 * clearTask
 * @return {Promise}
 */
function clearTask() {
  return new Promise((resolve, reject) => {
    const rimrafProcess = spawn(process.platform === "win32" ? `${commandPath}rimraf.cmd` : `${commandPath}rimraf`, [`${runtimePath}\\lib`], {
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
 * @return {Promise}
 */
function babelTask() {
  return new Promise((resolve, reject) => {
    const babelProcess = spawn(process.platform === "win32" ? `${commandPath}babel.cmd` : `${commandPath}babel`, [`${srcPath}\\src`, '-d', `${runtimePath}\\lib`, '--ignore', '__tests__'], {
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
    const gulpProcess = spawn(process.platform === "win32" ? `${commandPath}gulp.cmd` : `${commandPath}gulp`, ['--runtimepath', `${runtimePath}\\`, '--srcpath', `${srcPath}\\`], {
      cwd: codePath,
      encoding: 'utf-8',
    });

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
    // console.log('task3');
    // resolve();
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
  build: (args) => {
    argsMap = args;
    let srcpatharg = args.get('--srcpath');
    if (srcpatharg && Array.isArray(srcpatharg)) {
      srcpatharg = srcpatharg[0];
    }
    console.log('srcpatharg', srcpatharg);
    if (srcpatharg === '../') {
      srcPath = runtimePath.substring(0, runtimePath.lastIndexOf('\\'));
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