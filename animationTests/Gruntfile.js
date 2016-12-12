module.exports = function(grunt) {

  console.log("==================================================");
  console.log("Current distribution folder:", getNewDateString());


  // TODO: Document this initialization call.

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      output: getNewDateString()
    },

    assemble: {
      options: {
        layoutdir: './src/wrapper',
        layout: 'main.hbs',
        partials: ['./src/partials/**/*.hbs'],
        flatten: true,
      },
      site: {
        src: ['./src/pages/**/*.hbs'],
        dest: './src'
      }
    },

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
      prod: {
        options: {
          sourceMap: false,
          style: 'expanded'
        },
        files: {
          'src/temp/styles.pre.prod.css': 'src/sass/styles.scss'
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
      // Update the prod file with minification
      prod: {
        options: {
          map: false,
          processors: [
            require('autoprefixer')({
              browsers: ['last 4 versions']
            }),
            require('cssnano')() // minify the result
          ]
        },
        src: 'src/temp/styles.pre.prod.css',
        dest: 'dist/<%= dirs.output %>/css/styles.css'
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
      prod: {
        src: [
          'src/js/plugins/plugins.js',
          'src/temp/main-clean-ugly.js',
        ],
        dest: 'dist/<%= dirs.output %>/js/scripts.js'
      }
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

    removelogging: {
      dist: {
        src: "src/temp/main-bundled.js",
        dest: "src/temp/main-clean.js"
      },
    },

    uglify: {
      prod: {
        src: 'src/temp/main-clean.js',
        dest: 'src/temp/main-clean-ugly.js'
      },
      dd3: {
        src: 'src/js/plugins/DD3.js',
        dest: 'src/js/plugins/DD3.min.js',
      },
      console: {
        src: 'src/js/plugins/console-errors.js',
        dest: 'src/js/plugins/console-errors.min.js',
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        force: true,
      },
      dev: ['Gruntfile.js', './src/js/app.js', './src/js/modules/*'],
    },

    htmlmin: { // Task
      dist: { // Target
        options: { // Target options
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          preserveLineBreaks: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
        },
        files: [{
          expand: true,
          cwd: './src',
          src: ['./**/*.html', './*.html'],
          dest: 'dist/<%= dirs.output %>/'
        }]
      },
    },

    copy: {
      css: {
        files: [{
          src: 'src/css/styles.css',
          dest: 'dist/<%= dirs.output %>/css/styles.css',
        }],
      },
      js: {
        files: [{
          src: 'src/js/scripts.js',
          dest: 'dist/<%= dirs.output %>/js/scripts.js',
        }],
      },
      jsvendor: {
        expand: true,
        cwd: 'src/js/vendor',
        src: '**',
        dest: 'dist/<%= dirs.output %>/js/vendor',
      },
      html: {
        src: ['src/**/*.html', 'src/*.html'],
        dest: 'temp/<%= dirs.output %>/index.html',
      },
      imgs: {
        expand: true,
        cwd: 'src/',
        src: 'img/**/*',
        dest: 'dist/<%= dirs.output %>/',
        flatten: false,
        filter: 'isFile',
      },
    },

    imagemin: { // Task
      dynamic: { // Another target
        files: [{
          expand: true, // Enable dynamic expansion
          cwd: 'src/', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,JPG}'], // Actual patterns to match
          dest: 'dist/<%= dirs.output %>/' // Destination path prefix
        }]
      }
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
      pages: {
        files: ['src/**/*.hbs', 'src/*.hbs'],
        tasks: ['assemble:site',
                'postcss:dev'],
        options: {
          spawn: false,
        },
      }
    }

  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['express', 'watch']);

  grunt.registerTask('compressimages', ['newer:imagemin']);

  grunt.registerTask('dev', ['browserify:dev',
                             'concat:dev',
                             'sass:dev',
                             'postcss:dev',
                             'assemble:site',
                             'express',
                             'watch']);

  grunt.registerTask('prod', ['sass:prod',
                              'postcss:prod',
                              'removelogging:dist',
                              'uglify:prod',
                              'concat:prod',
                              'htmlmin:dist',
                              'copy:imgs',
                              'copy:jsvendor']);

};


function getNewDateString() {
  var curDate = new Date();
  var curYear = "16";
  var curMonth = curDate.getMonth() + 1;
  var curDay = curDate.getDate();
  var curHours = curDate.getHours();
  var curMinutes = curDate.getMinutes();

  var dateString = "dist-";

  dateString += (curMonth <= 9) ? "0" + curMonth.toString() : (curMonth).toString();
  dateString += (curDay <= 9) ? "0" + curDay.toString() : (curDay).toString();

  dateString += curYear;
  dateString += "_";

  dateString += (curHours <= 9) ? "0" + curHours.toString() : (curHours).toString();
  dateString += (curMinutes <= 9) ? "0" + curMinutes.toString() : (curMinutes).toString();

  return dateString;
};
