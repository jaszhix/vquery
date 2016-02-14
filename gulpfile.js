var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var htmlclean = require('gulp-htmlclean');

gulp.task('svgmin', function() {
  return gulp.src('./dist/*.svg')
    .pipe(htmlclean())
    .pipe(gulp.dest('dist'));
});
gulp.task('images-dist', ['svgmin'], function () {
  return gulp.src('./dist/*.{png,jpg,gif}')
    .pipe(imagemin({
      optimizationLevel: 3,
      interlaced: true
    }))
    .pipe(gulp.dest('./dist'));
});
gulp.task('move',['images-dist'], function(){
  gulp.src('./dist')
  .pipe(gulp.dest('./'));
});
gulp.task('moveHtml',['move'], function(){
  gulp.src('./app/index.html')
  .pipe(gulp.dest('./'));
});
gulp.task('moveFavicon',['moveHtml'], function(){
  gulp.src('./app/assets/images/favicon.png')
  .pipe(gulp.dest('./'));
});
gulp.task('post-build', ['moveFavicon'], function() {
  console.log('Post build...');
});

