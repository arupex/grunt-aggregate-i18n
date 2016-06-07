/**
 * Created by daniel.irwin on 6/6/16.
 */
module.exports = function Aggregate18nFiles(grunt) {

    //Config
    //
    // {
    //      fallbackLanguage : 'en',
    //      fallbackTerritory : 'US',
    //      languages : [ 'en', 'nb'],
    //      territories : ['US', 'NO'],
    //      src : [
    //          {
    //              namespace : 'test',
    //              path : 'l10n/{{language}}/{{territory}}/test.json'
    //          }
    //      ],
    //      dest : 'dist/l10n/{{language}}_{{territory}}.json',

    // }
    //
    //

    //How Fallback Works
    //  All Files are loaded and keys are aggregated
    // If a file is missing a key, it falls back to fallback territory
    // If key is missing in fallback territory, it fallsback to fallback locale, but with original territory
    // If key is still missing it falls back to fallback locale, and fallback territory
    // If key is still missing it references key as value

    //Future:
    //keepInMemory Option:
    //while keepInMemory can offer a great performance increase, it will also consume a lot more memory
    // keepInMemory does not require 2 pass for looking up keys and generating files, while keepInMemory : false does
    // keepInMemory false however does require approx twice as much disk reads

    grunt.registerTask('aggregate-i18n', function(){

        var options = this.options();

        var done = this.async();

        require('./aggregateFilesi18n')(options, done);

    });

};