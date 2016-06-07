/**
 * Created by daniel.irwin on 6/6/16.
 */
module.exports = function aggregateFilesI18n(options, done){

    var fs = require('fs');
    var pathLib = require('path');

    var files = options.src || [];

    var languages = options.languages || [];
    var territories = options.territories || [];

    var fallbackLanguage = options.fallbackLanguage;
    var fallbackTerritory = options.fallbackTerritory;

    var keys = {};

    //var keepInMemory = options.keepInMemory;

    var mapOfLangTerr = {};


    function determineKeys(data){
        Object.keys(data).forEach(function iterateKeys(key){
            keys[key] = true;
        });
    }

    function nameSpaceFile(file, namespace){
        if(!namespace){
            return file;
        }

        var result = {};
        Object.keys(file).forEach(function iterateFiles(key){
           result[namespace+key] = file[key];
        });
        return result;
    }

    function extendKeys(original, extender){
        Object.keys(extender).forEach(function iterateExt(key){
            original[key] = extender[key];
        });
        return original;
    }


    function setMemory(lang, terr, data) {


        //console.log('setMemory', mapOfLangTerr);

        if (!mapOfLangTerr[lang]) {
            mapOfLangTerr[lang] = {};
        }
        if(!mapOfLangTerr[lang][terr]){
            mapOfLangTerr[lang][terr] = {};
        }
        mapOfLangTerr[lang][terr] = extendKeys(mapOfLangTerr[lang][terr], data);
    }

    function handleKeyFallback(lang, terr, key) {
        //handle missing languages
        if (!mapOfLangTerr[lang]) {
            mapOfLangTerr[lang] = clone(mapOfLangTerr[fallbackLanguage]);
        }

        //handle territory fallback
        if (!mapOfLangTerr[lang][terr]) {
            if (mapOfLangTerr[lang][fallbackTerritory]) {
                mapOfLangTerr[lang][terr] = clone(mapOfLangTerr[lang][fallbackTerritory]);
            }
            else if (mapOfLangTerr[fallbackLanguage][terr]) {
                mapOfLangTerr[lang][terr] = clone(mapOfLangTerr[fallbackLanguage][terr]);
            }
            else {
                mapOfLangTerr[lang][terr] = clone(mapOfLangTerr[fallbackLanguage][fallbackTerritory]);
            }
        }

        //handle missing keys
        if (!mapOfLangTerr[lang][terr][key]) {
            if (mapOfLangTerr[lang][fallbackTerritory] && mapOfLangTerr[lang][fallbackTerritory][key]) {
                mapOfLangTerr[lang][terr][key] = clone(mapOfLangTerr[lang][fallbackTerritory][key]);
            }
            else if (mapOfLangTerr[fallbackLanguage][terr] && mapOfLangTerr[fallbackLanguage][terr][key]) {
                mapOfLangTerr[lang][terr][key] = clone(mapOfLangTerr[fallbackLanguage][terr][key]);
            }
            else {
                mapOfLangTerr[lang][terr][key] = clone(mapOfLangTerr[fallbackLanguage][fallbackTerritory][key]);
            }
        }
    }

    function getMemory(lang, terr){
        Object.keys(keys).forEach(function iterateKeys(key){
            handleKeyFallback(lang, terr, key);
        });

        if(!mapOfLangTerr[lang]){
            //console.log('shift', lang, terr, mapOfLangTerr);
            return {};//oh shit
        }

        return mapOfLangTerr[lang][terr];
    }

    function forEachFileLangTerr(cb){
        files.forEach(function iterateFile(file){
            forEachLangTerr(function iterateLangTerr(lang, terr){
                cb(file, lang, terr);
            });
        });
    }

    function forEachLangTerr(cb){
        languages.forEach(function iterateLang(lang){
            territories.forEach(function iterateTerr(terr){
                cb(lang, terr);
            });
        });
    }


    function clone(data){
        if(!data){
            return {};
        }
        return JSON.parse(JSON.stringify(data));
    }

    function parsePath(path, language, territory){
        var langRegex = /\{\{language\}\}/g;
        var territoryRegex = /\{\{territory\}\}/g;

        var result = path.replace(langRegex, language).replace(territoryRegex, territory);
        //console.log('', result, arguments);
        return result;
    }

    function writeFile(path, data){
        fs.writeFileSync(path, JSON.stringify(data, null, 3));
    }

    function readFile(path){
        return JSON.parse(fs.readFileSync(path));
    }


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

    (function main(){

        forEachFileLangTerr(function iterateFile(file, lang, terr){
            var path = parsePath(file.path, lang, terr);

            try {
                var data = nameSpaceFile(readFile(path), file.namespace);
                //if(keepInMemory){
                //if(keepInMemory){
                //console.log('data', data);
                setMemory(lang, terr, data);
                //}
                //else{
                //    setMemory(lang, terr, true);
                //}
                determineKeys(data);
            }
            catch(e){
                //console.log('', e);
                //setMemory(lang, terr, null);
            }

        });

        var dest = options.dest;

        //do primary lang/terr
        var parsePath2 = parsePath(dest, fallbackLanguage, fallbackTerritory);
        ensureDirectoryExistence(parsePath2);
        writeFile(parsePath2, getMemory(fallbackLanguage, fallbackTerritory));


        territories.forEach(function iterateTerr(terr){
            var path = parsePath(dest, fallbackLanguage, terr);
            ensureDirectoryExistence(path);
            writeFile(path, getMemory(fallbackLanguage, terr));
        });

        languages.forEach(function iterateLangs(lang){
            var path = parsePath(dest, lang, fallbackTerritory);
            ensureDirectoryExistence(path);
            writeFile(path, getMemory(lang, fallbackTerritory));
        });

        forEachLangTerr(function iterateLangsTerr(lang, terr){
            //if(lang === fallbackLanguage && terr === fallbackTerritory){
            //    return;
            //}
            var path = parsePath(dest, lang, terr);
            ensureDirectoryExistence(path);
            writeFile(path, getMemory(lang, terr));
        });
        done();
    })();

};