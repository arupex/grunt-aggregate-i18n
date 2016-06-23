/**
 * Created by daniel.irwin on 6/23/16.
 */
module.exports = function(dest, data, done) {

    var fs = require('fs');
    var pathLib = require('path');

    var parsePath = require('./parsePath');

    //http://stackoverflow.com/questions/13542667/create-directory-when-writing-to-file-in-node-js
    function ensureDirectoryExistence(filePath) {
        var dirname = pathLib.dirname(filePath);
        if (directoryExists(dirname)) {
            return true;
        }
        ensureDirectoryExistence(dirname);
        fs.mkdirSync(dirname);
    }

    function directoryExists(path) {
        try {
            return fs.statSync(path).isDirectory();
        }
        catch (err) {
            return false;
        }
    }

    function writeFile(path, data){
        fs.writeFileSync(path, JSON.stringify(data, null, 3));
    }

    Object.keys(data).forEach(function(lang){

        Object.keys(data[lang]).forEach(function(terr){

            var path = parsePath(dest, lang, terr);
            ensureDirectoryExistence(path);
            writeFile(path, data[lang][terr]);

        });

    });
    done();

};