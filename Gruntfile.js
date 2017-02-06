
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      src: 'index.html',
      dist: 'build/'
    },
    'string-replace': {
      dist: {
        files: {
          'build/': 'index.html'
        },
        options: {
          replacements: [{
            pattern: /@cacheBuster/g,
            replacement: '<%= pkg.version %>'
          }]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-string-replace');

  // Default task(s).
  grunt.registerTask('default', ['string-replace']);

};