const {spawn} = require('child_process');
// 运行脚本的路径
const runtimePath = process.cwd();
// 脚本的路径
const codePath = __dirname;
const commandPath = `${codePath}\\node_modules\\.bin\\`;

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
    const babelProcess = spawn(process.platform === "win32" ? `${commandPath}babel.cmd` : `${commandPath}babel`, [`${runtimePath}\\src`, '-d', `${runtimePath}\\lib`, '--ignore', '__tests__'], {
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
    const gulpProcess = spawn(process.platform === "win32" ? `${commandPath}gulp.cmd` : `${commandPath}gulp`, ['--runtimepath', `${runtimePath}\\`], {
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

const tasks = [clearTask, babelTask, gulpTask];
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
  build: () => {
    loopTask().then(() => {
      console.log('finish');
      process.exit();
    }).catch((error) => {
      console.log(error);
    });
  }
};