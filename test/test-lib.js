var should = require('should')
var del = require('del')
var assert = require('yeoman-assert')

var TEMP = 'test/temp'
var EXAMPLE = 'example/frontbase'
var EXAMPLE_DIST = EXAMPLE + '/dist'
var NODE_DIR = EXAMPLE + '/node_modules'

var cleanup = function() {
	del.sync([TEMP, EXAMPLE_DIST, NODE_DIR])
}

describe('Mango class', function() {
	var Mango = require('../lib/mango')
	var Config = require('../lib/helpers/config')

	describe('should create a new instance', function() {

		it('with no arguments', function() {
			new Mango()
		})

		it('with only the folder argument', function() {
			new Mango(process.cwd())
		})

		it('with a folder argument and an empty object as the config parameter', function() {
			new Mango(process.cwd(), {})
		})

	})

	describe('should in a temp directory', function() {

		before(cleanup)

		it('init a template', function(done) {
			this.timeout(15000)
			var pkg = require('../package')
			var config = new Config('example/frontbase')
			var mango2 = new Mango(TEMP, config.get())
			mango2.init(pkg.config.default_fork_repo, done)
		})

		after(cleanup)
	})

	describe('should in the example directory', function() {
		var mango

		before(cleanup)

		it('read the configuration file', function() {
			var config = new Config('example/frontbase')
			mango = new Mango(EXAMPLE, config.get())
		})

		it('install dependencies', function(done) {
			this.timeout(60000)
			mango.install(done)
		})

		it('run the production build task', function(done) {
			this.timeout(15000)
			mango.build([], done)
		})

		it('build scripts files', function() {
			assert.file([
				EXAMPLE_DIST + '/js/index.js',
				EXAMPLE_DIST + '/js/index-next.js'
			])
		})

		it('build styles files', function() {
			assert.file([
				EXAMPLE_DIST + '/styles/screen.css',
				EXAMPLE_DIST + '/styles/test.css'
			])
		})

		it('build images files', function() {
			assert.file([
				EXAMPLE_DIST + '/img/rocket512.png',
				EXAMPLE_DIST + '/img/stars.png',
				EXAMPLE_DIST + '/img/twinkling.png',
				EXAMPLE_DIST + '/img/bar/one.svg',
				EXAMPLE_DIST + '/img/bar/two.svg',
				EXAMPLE_DIST + '/img/bar/three.svg'
			])
		})

		it('build sprites files', function() {
			assert.file([
				EXAMPLE_DIST + '/sprites/shapes-bar.svg'
			])
		})

		it('build templates files', function() {
			assert.file([
				EXAMPLE_DIST + '/index.html'
			])
		})


		// it('run development mode task', function() {
		// 	mango.dev()
		// })

		after(cleanup)
	})


})
