/*jslint node: true */
'use strict';

var pkg = require('./package.json');

//Using exclusion patterns slows down Grunt significantly
//instead of creating a set of patterns like '**/*.js' and '!**/node_modules/**'
//this method is used to create a set of inclusive patterns for all subdirectories
//skipping node_modules, bower_components, dist, and any .dirs
//This enables users to create any directory structure they desire.


module.exports = function (grunt) {

  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({

    copy: {
      dist: {
        files:[
          {cwd: 'node_modules/bootstrap', src: 'less/**', dest: 'build/',expand: true},
          {cwd: 'node_modules/bootstrap', src: 'fonts/**', dest: 'build/',expand: true}
        ]
      }
    },
    clean: {
      build: ["build"]
    },
    bump: {
        options: {
          files: ['package.json','bower.json'],
          updateConfigs: [],
          commit: true,
          commitMessage: 'Release v%VERSION%',
          commitFiles: ['package.json','bower.json'],
          createTag: true,
          tagName: 'v%VERSION%',
          tagMessage: 'Release Version %VERSION%',
          push: true,
          pushTo: 'upstream',
          gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
          globalReplace: false,
          prereleaseName: false,
          regExp: false
        }
    },
    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'bootstrap.css.map',
          sourceMapFilename: 'build/css/bootstrap.css.map'
        },
        src: 'build/less/bootstrap.less',
        dest: 'build/css/bootstrap.css'
      },
      compileTheme: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'bootstrap-theme.css.map',
          sourceMapFilename: 'build/css/bootstrap-theme.css.map'
        },
        src: 'build/less/theme.less',
        dest: 'build/css/bootstrap-theme.css'
      }
    },
    devUpdate: {
        check: {
            options: {
                updateType: 'report', //just report outdated packages
                reportUpdated: false, //don't report up-to-date packages
                semver: true, //stay within semver when updating
                packages: {
                    devDependencies: true, //only check for devDependencies
                    dependencies: false
                },
                reportOnlyPkgs: [] //use updateType action on all packages
            }
        },
        main: {
          options: {
                updateType: 'prompt', //just report outdated packages
                reportUpdated: false, //don't report up-to-date packages
                semver: false, //stay within semver when updating
                packages: {
                    devDependencies: true, //only check for devDependencies
                    dependencies: false
                },
                reportOnlyPkgs: ['grunt', 'grunt-contrib-clean' ,'grunt-contrib-copy','grunt-contrib-less','grunt-less-imports', 'grunt-open','jit-grunt','load-grunt-tasks','grunt-dev-update']
        }
    }
  }
    //}
  });


//grunt build should run grunt test first, if everything passes, then run the rest of thte build commands.
  grunt.registerTask('build', function (target){
    if(target === 'dev'){
      return grunt.task.run(['clean:build', 'copy:dist']);
      //return grunt.task.run(['concurrent:target1']);

    }
    else{
      //return grunt.task.run(['concurrent:target1']);
      return grunt.task.run(['clean:build', 'copy:dist']);

    }
  });
  grunt.registerTask('compile', ['less:compileCore','less:compileTheme']);
  grunt.registerTask('default', ['build','compile']);
  grunt.registerTask('update', ['devUpdate:main']);
  grunt.registerTask('check', ['devUpdate:check']);
};
