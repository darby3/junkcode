module.exports = function(grunt) {

  console.log("==================================================");

  // TODO: Document this initialization call.

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        options: {
          sourceMap: true,
          style: 'expanded'
        },
        files: {
          'src/temp/styles.pre.css': 'src/sass/styles.scss'
        }
      },
    },

    postcss: {
      // Update the dev file with autoprefixer
      dev: {
        options: {
          map: true,
          processors: [
            require('autoprefixer')({
              browsers: ['last 4 versions']
            }),
          ]
        },
        src: 'src/temp/styles.pre.css',
        dest: 'src/css/styles.css'
      },
    },

    concat: {
      options: {
        sourceMap: true,
      },
      dev: {
        src: [
          'src/js/plugins/plugins.js',
          'src/temp/main-bundled.js',
        ],
        dest: 'src/js/scripts.js'
      },
    },

    browserify: {
      options: {
        sourceMap: true,
        transform: [
          ["babelify", {
            "presets": ["es2015"]
          }]
        ]
      },
      dev: {
        src: 'src/js/app.js',
        dest: 'src/temp/main-bundled.js',
        options: {
           sourceMap: true,
           browserifyOptions: {
             debug: true
           }
         }
       },
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        force: true,
      },
      dev: ['Gruntfile.js', './src/js/app.js', './src/js/modules/*'],
    },

    // Grunt express - our webserver
    // https://github.com/blai/grunt-express
    express: {
      all: {
        options: {
          bases: ['./src'],
          hostname: "0.0.0.0",
          livereload: true,
          port: 1337
        }
      }
    },

    // Basically the watch task is JUST for the dev folder.
    // Run a separate prod task to copy everything over to prod, minify, etc.

    watch: {
      scripts: { // sort this out...basically need to do my own stuff then concat it and copy it to dist...
        files: ['src/**/*.js'],
        tasks: ['browserify:dev',
                'concat:dev',
                'jshint:dev'],
        options: {
          spawn: false,
        },
      },
      styles: {
        files: ['src/sass/**.scss', 'src/sass/**/*.scss'],
        tasks: ['sass:dev',
                'postcss:dev'],
        options: {
          spawn: false,
        },
      },
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['browserify:dev',
                                 'concat:dev',
                                 'sass:dev',
                                 'postcss:dev',
                                 'express',
                                 'watch']);

};
