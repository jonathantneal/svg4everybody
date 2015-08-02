module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: true
			},
			build: [
				'Gruntfile.js',
				'lib/svg4everybody.js'
			]
		},
		uglify: {
			options: {
				compress: {
					global_defs: {
						"LEGACY_SUPPORT": grunt.option('legacy') !== undefined ? grunt.option('legacy') : true
					}
				}
			},
			build: {
				files: [
					{
						src: 'svg4everybody.min.js',
						dest: 'svg4everybody.min.js'
					}
				]
			}
		},
		umd: {
			build: {
				options: {
					src: 'lib/svg4everybody.js',
					dest: 'svg4everybody.min.js',
					globalAlias: 'svg4everybody',
					objectToExport: 'svg4everybody'
				}
			}
		},
		watch:  {
			files: ['lib/svg4everybody.js'],
			tasks: ['test', 'build']
		}
	});

	require('load-grunt-tasks')(grunt);

	// npm run test
	grunt.registerTask('test', ['jshint']);

	// npm run build, grunt build
	grunt.registerTask('build', ['test', 'umd', 'uglify']);

	// npm run watch, grunt build:watch
	grunt.registerTask('build:watch', ['build', 'watch']);

	// grunt
	grunt.registerTask('default', ['build']);
};
