module.exports = function(gulp, config) {

	return function(done) {
		var c = require('better-console')
		c.info('watch reload')

		var browsersync = require('browser-sync')
		var fs = require('fs')

		var bsOptions = {}

		// Switch between proxy and server modes
		if(config.proxy) {
			bsOptions.proxy = config.proxy
		} else {
			bsOptions.server = { baseDir: config.dist_folder }
		}
		// Fix for Nette debug bar
		bsOptions.snippetOptions = {
			rule: {
				match: /<body[^>]*>/i,
				fn: function (snippet, match) {
					if(match === '<body id=\\"tracy-debug\\">') {
						return match
					}
					return match + snippet;
				}
			}
		}
		// Start a browsersync server
		browsersync(bsOptions)

		// Now configude watch task
		var glob = [ config.dist_folder + '/**/*.*' ]

		if(config.watch) {
			glob = glob.concat(config.watch)
		}

		var options = {
			base: config.dir,
			read: false
		}

		var changeHandler = function(file) {
			// files only
			if(!fs.existsSync(file.path) || !fs.lstatSync(file.path).isFile()) {
				return false
			}
			c.log('- handling reload', file.path)
			browsersync.reload(file.path)
		}

		return gulp.watch(glob, options, changeHandler)
	}
}
