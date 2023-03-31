const path = require('path');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const merge2 = require('merge2');

// 代码编译路径
const compilePath = process.env.compilePath;

// 代码输出路径
const outputPath = process.env.outputPath;

// 配置文件路径
const configPath = process.env.configPath;

const customConfig = require(configPath);

const tsProject = ts.createProject(customConfig.getTsConfigPath());
const babelConfig = require(path.join(__dirname, 'babel.config.js'));

customConfig.getBabelConfig(babelConfig);

gulp.task('default', function () {
  const tsResult = gulp
    .src([
      path.join(compilePath, '**', '*.js'),
      path.join(compilePath, '**', '*.jsx'),
      path.join(compilePath, '**', '*.ts'),
      path.join(compilePath, '**', '*.tsx'),
    ])
    .pipe(tsProject());

  // .d.ts
  const tsFilesStream = tsResult.dts.pipe(gulp.dest(outputPath));
  // .js
  const tsd = tsResult.js.pipe(babel(babelConfig)).pipe(gulp.dest(outputPath));
  // merge
  return merge2([tsFilesStream, tsd]);
});
