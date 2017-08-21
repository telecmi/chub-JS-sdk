module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            "my_target": {
                files: {
                    'dist/chub.min.js': ['src/jssip.js','src/chub-sdk.js']
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify'); // load the given tasks
    grunt.registerTask('default', ['uglify']);
}
