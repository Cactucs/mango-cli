
module.exports = function(gulp, config) {

	return function(done) {
		if(!config.styles) return done()
		var c = require('better-console')
		c.info('~ styles')

		var path = require('path')
		var stylus = require('gulp-stylus')
		var nib = require('nib')
		var cssmin = require('gulp-cssmin')
		var plumber = require('gulp-plumber')


		var stylus_options = {
			use: nib(),
			define: {
				debug: config.devmode
			},
			sourcemap: {
				inline: true
			}
		}

		if(config.devmode) {
			stylus_options.sourcemap = { inline: true }
		}

		var task = gulp.src(config.styles, { base: config.src_folder })
			.pipe(plumber({ errorHandler: require('../helpers/error_handler') }))
			.pipe(stylus(stylus_options))

		if(!config.devmode) {
			task = task.pipe(cssmin())
		}

		return task.pipe(gulp.dest(config.dist_folder))
	}
}
