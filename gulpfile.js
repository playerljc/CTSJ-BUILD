const gulp = require('gulp');
const uglify = require("gulp-uglify");
const clean = require('gulp-clean');
const copyexts = ['less', 'svg', 'jpg', 'jpeg', 'png', 'bmp'];
const commandArgs = require('./commandArgs');
const argsMap = commandArgs.initCommandArgs();
const runtimePath = argsMap.get('--runtimepath')[0];

gulp.task('copy', () => {
  for (let i = 0; i < copyexts.length; i++) {
    gulp.src(`${runtimePath}src\\**\\*.${copyexts[i]}`).pipe(gulp.dest(`${runtimePath}lib`));
  }
});

gulp.task('minjs', () => {
  return gulp.src([
    `${runtimePath}lib\\src\\*.js`
  ]).pipe(uglify()).pipe(gulp.dest(`${runtimePath}lib`))
});


gulp.task('clean', ['minjs'], () => {
  gulp.src(`${runtimePath}lib\\src`).pipe(clean({force: true}));
});

gulp.task('default', ['copy', 'clean']);