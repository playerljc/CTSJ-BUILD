const gulp = require('gulp');
const uglify = require("gulp-uglify");
const sourceMap = require('gulp-sourcemaps');
const copyexts = ['less', 'svg', 'jpg', 'jpeg', 'png', 'bmp', 'json', 'eot', 'woff', 'ttf'];
const commandArgs = require('./commandArgs');
const argsMap = commandArgs.initCommandArgs();
const runtimePath = argsMap.get('--runtimepath')[0];
const srcPath = argsMap.get('--srcpath')[0];

gulp.task('copy', () => {
  for (let i = 0; i < copyexts.length; i++) {
    gulp.src(`${srcPath}src\\**\\*.${copyexts[i]}`).pipe(gulp.dest(`${runtimePath}lib`));
  }
});

gulp.task('minjs', () => {
  return gulp.src([
    `${runtimePath}lib\\**\\*.js`,
    `${runtimePath}lib\\**\\*.jsx`,
  ]).pipe(sourceMap.init())
    .pipe(uglify())
    .pipe(sourceMap.write('.'))
    .pipe(gulp.dest(`${runtimePath}lib`))
});

gulp.task('default', ['copy', 'minjs']);