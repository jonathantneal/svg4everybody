module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		eslint: {
			gruntfile: {
				options: {
					rules: {
						camelcase: [0],
						'global-require': [0]
					}
				},
				files: {
					src: ['Gruntfile.js']
				}
			},
			buildfile: {
				options: {
					globals: ['LEGACY_SUPPORT', 'svg4everybody'],
					rules: {
						'no-magic-numbers': [0],
						'no-unused-vars': [0]
					}
				},
				files: {
					src: ['lib/svg4everybody.js']
				}
			}
		},
		jscs: {
			gruntfile: {
				options: {
					requireCamelCaseOrUpperCaseIdentifiers: null
				},
				files: {
					src: ['Gruntfile.js']
				}
			},
			buildfile: {
				files: {
					src: ['lib/svg4everybody.js']
				}
			}
		},
		uglify: {
			build: {
				files: {
					'dist/svg4everybody.js': ['dist/svg4everybody.legacy.js']
				},
				options: {
					beautify: {
						beautify: true,
						bracketize: true
					},
					compress: {
						global_defs: {
							LEGACY_SUPPORT: false
						}
					},
					mangle: false,
					preserveComments: 'some'
				}
			},
			buildmin: {
				files: {
					'dist/svg4everybody.min.js': ['dist/svg4everybody.legacy.js']
				},
				options: {
					compress: {
						global_defs: {
							LEGACY_SUPPORT: false
						}
					},
					preserveComments: 'some'
				}
			},
			legacy: {
				files: {
					'dist/svg4everybody.legacy.js': ['dist/svg4everybody.legacy.js']
				},
				options: {
					beautify: {
						beautify: true,
						bracketize: true
					},
					compress: {
						global_defs: {
							LEGACY_SUPPORT: true
						}
					},
					mangle: false,
					preserveComments: 'some'
				}
			},
			legacymin: {
				files: {
					'dist/svg4everybody.legacy.min.js': ['dist/svg4everybody.legacy.js']
				},
				options: {
					compress: {
						global_defs: {
							LEGACY_SUPPORT: true
						}
					},
					preserveComments: 'some'
				}
			}
		},
		umd: {
			build: {
				options: {
					src: 'lib/svg4everybody.js',
					dest: 'dist/svg4everybody.legacy.js',
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
	grunt.registerTask('test', ['eslint', 'jscs']);

	// npm run build, grunt build
	grunt.registerTask('build', ['test', 'umd', 'uglify']);

	// npm run watch, grunt build:watch
	grunt.registerTask('build:watch', ['build', 'watch']);

	// grunt
	grunt.registerTask('default', ['build']);
};
