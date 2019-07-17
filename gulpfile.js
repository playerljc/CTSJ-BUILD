const path = require('path');
const gulp = require('gulp');
const uglify = require("gulp-uglify");
const sourceMap = require('gulp-sourcemaps');
const copyexts = ['less', 'svg', 'jpg', 'jpeg', 'png', 'bmp', 'json', 'eot', 'woff', 'ttf'];
const commandArgs = require('./commandArgs');
const argsMap = commandArgs.initCommandArgs();
const runtimePath = argsMap.get('--runtimepath')[0];
const srcPath = argsMap.get('--srcpath')[0];

// buildpackage生成的目录名称
const generateDirName = 'lib';
// buildpackage原始名称
const srcDirName = 'src';

/**
 * copy
 */
gulp.task('copy', () => {
  for (let i = 0; i < copyexts.length; i++) {
    // gulp.src(`${srcPath}${srcDirName}\\**\\*.${copyexts[i]}`).pipe(gulp.dest(`${runtimePath}${generateDirName}`));
    gulp.src(path.join(`${srcPath}${srcDirName}`,'**',`*.${copyexts[i]}`))
        .pipe(gulp.dest(`${runtimePath}${generateDirName}`));
  }
});

/**
 * 压缩
 */
gulp.task('minjs', () => {
  return gulp.src([
    // `${runtimePath}lib\\**\\*.js`,
    // `${runtimePath}lib\\**\\*.jsx`,
    path.join(`${runtimePath}${generateDirName}`,'**','*.js'),
    path.join(`${runtimePath}${generateDirName}`,'**','*.jsx'),
  ]).pipe(sourceMap.init())
    .pipe(uglify())
    .pipe(sourceMap.write('.'))
    .pipe(gulp.dest(`${runtimePath}${generateDirName}`))
});

gulp.task('default', ['copy', 'minjs']);