gulp = require 'gulp'
coffee = require 'gulp-coffee'

gulp.task 'coffee', ->
	gulp.src 'coffee/*.coffee'
		.pipe do coffee
		.pipe gulp.dest 'public/js'

gulp.task 'watch', ->
	gulp.watch 'coffee/*.coffee', ['coffee']

gulp.task 'default', ['coffee', 'watch']