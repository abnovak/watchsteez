// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

var mountFolder = function(connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        exec: {
            bower: {
                cmd: 'bower install',
                stdOut: true
            },
            npm: {
                cmd: 'npm install',
                stdOut: true
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './app/lib',
                    layout: 'byComponent',
                    install: true,
                    verbose: false,
                    cleanTargetDir: false,
                    cleanBowerDir: false,
                    bowerOptions: {}
                }
            }
        },
        compass: { // Task           
            dev: { // Another target
                options: {
                   config: 'config.rb',
                   specify: 'app/scss/main.scss'
                }
            }
        },
        watch: {
            html: {
                options: {
                    livereload: true
                },
                files: [
                    'app/templates/**/*',
                    'app/templates/layouts/**/*',
                    'app/templates/partials/**/*'
                ],
            },
            js: {
                options: {
                    livereload: true
                },
                files: [
                    'app/js/**/*',
                    'app/js/plugins/**/*'
                ],
            },
            sass: {
                options: {
                    livereload: false
                },
                files: [
                    'app/scss/**/*',
                ],
                tasks: ['compile-style'],
            },
            css: {
                options: {
                    livereload: true
                },
                files: ['app/css/main.css'],
                tasks: [],
            }
            // livereload: {
            //     files: [


            //         'app/scss/**/*',
            //         'app/lib/bootstrap-sass/example/**/*'
            //     ]
            // }
        },
        execute: {
            deploy: {
                src: ['build.js']
            }
        },
        clean: {
            build: ["build/", "dist/"]
        },
        express: {
            dev: {
                options: {
                    debug: true,
                    port: 8080,
                    script: 'server.js',
                    background: true
                }
            }
        }
    });

    // grunt.event.on('watch', function(action, filepath) {
    //     grunt.task.run(['compass:dev']);
    // });    

    grunt.registerTask('setup', ['exec:bower', 'exec:npm']);

    grunt.registerTask('server', ['compile-style', 'express:dev', 'watch']);

    grunt.registerTask('build', 'Building your templates.', ['clean', 'compile-style', 'express:dev']);

    grunt.registerTask('compile-style', ['compass:dev']);

    grunt.registerTask('heroku', ['compile-style']);

    grunt.registerTask('default', ['server']);
};