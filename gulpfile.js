// include gulp
var gulp = require('gulp'),
	nodemon = require('nodemon');

gulp.task('start', function () {
  nodemon({
    script: 'server.js'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  });
});

// Default task(s): start the server
gulp.task('default', ['start']);