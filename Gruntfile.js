// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});
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
                   config: 'config.rb'
                }
            }
        },
        bless: {
            css: {
                options: {
                    // Task-specific options go here.
                    imports: false
                },
                files: {
                    // Target-specific file lists and/or options go here.
                    'app/css/main.css':'app/css/main.css'
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
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function(connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'server.js',
                    node_env: 'dev'
                }
            },
            build: {
                options: {
                    script: 'server.js',
                    node_env: 'build'
                }
            },
            prod: {
                options: {
                    script: 'server.js',
                    node_env: 'prod'
                }
            }
        },
        execute: {
            deploy: {
                src: ['build.js']
            }
        },
        clean: {
            build: ["build/", "dist/"]
        }
    });

    // grunt.event.on('watch', function(action, filepath) {
    //     grunt.task.run(['compass:dev']);
    // });    

    grunt.registerTask('setup', ['exec:bower', 'exec:npm']);

    grunt.registerTask('server', ['compile-style', 'express:dev', 'connect:livereload', 'watch']);

    grunt.registerTask('stop-server', ['express:dev:stop']);

    grunt.registerTask('build', 'Building your templates.', ['clean', 'compile-style', 'express:build', 'execute:deploy', 'express:build:stop']);

    grunt.registerTask('compile-style', ['compass:dev']);

    grunt.registerTask('heroku', ['setup', 'compile-style']);

    grunt.registerTask('default', ['server']);
};