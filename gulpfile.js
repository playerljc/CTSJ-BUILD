const path = require('path');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const sourceMap = require('gulp-sourcemaps');
const commandArgs = require('./src/commandArgs');

const copyexts = [
  'less',
  'sass',
  'css',
  'svg',
  'jpg',
  'jpeg',
  'gif',
  'png',
  'bmp',
  'json',
  'eot',
  'woff',
  'ttf',
  'xml',
  'yml',
  'yaml',
  'mp4',
  'avi',
  'mp3',
  'rmvb',
];

const argsMap = commandArgs.initCommandArgs();
const outputpath = argsMap.get('--outputpath')[0];
const compilePath = argsMap.get('--compilepath')[0];

// buildpackage生成的目录名称
// const generateDirName = 'lib';

/**
 * copy
 */
gulp.task('copy', () => {
  const srcs = copyexts.map((ext) => path.join(compilePath, '**', `*.${ext}`));
  return gulp.src(srcs).pipe(gulp.dest(outputpath));

  // for (let i = 0; i < copyexts.length; i++) {
  //   gulp.src(path.join(compilePath, '**', `*.${copyexts[i]}`)).pipe(gulp.dest(outputpath));
  // }
});

/**
 * 压缩
 */
gulp.task('minjs', () => {
  return gulp
    .src([
      // `${runtimePath}lib\\**\\*.js`,
      // `${runtimePath}lib\\**\\*.jsx`,
      path.join(outputpath, '**', '*.js'),
      path.join(outputpath, '**', '*.jsx'),
    ])
    .pipe(sourceMap.init())
    .pipe(uglify())
    .pipe(sourceMap.write('.'))
    .pipe(gulp.dest(outputpath));
});

gulp.task('default', gulp.series('copy', 'minjs'));
