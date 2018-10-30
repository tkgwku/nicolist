var gulp = require('gulp');
var typescript = require('gulp-typescript');

gulp.task('compile:ts', function(){
	return gulp.src(['ts/*.ts'])
		.pipe(typescript())
		.js
		.pipe(gulp.dest('js/'));
});

gulp.task('default',['compile:ts']);