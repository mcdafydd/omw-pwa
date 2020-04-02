'use strict';
 
const gulp = require('gulp');
const sass = require('gulp-sass');
const workboxBuild = require('workbox-build');
 
sass.compiler = require('node-sass');
 
gulp.task('generate-sw', () => {
    return workboxBuild.generateSW({
      swDest: 'sw.js',
      globDirectory: 'dist',
      globPatterns: ['**/*.{js,css,html}']
    });
});

gulp.task('sass', function () {
  return gulp.src(['src/*.scss', 'src/sass/*.scss', '!src/sass/partials{,/**}', 'node_modules/@fullcalendar/**/*.css'])
    .pipe(sass({ includePaths: ['node_modules'] }))
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
});

