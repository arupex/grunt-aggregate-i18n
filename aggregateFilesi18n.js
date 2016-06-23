/**
 * Created by daniel.irwin on 6/6/16.
 */
module.exports = function aggregateFilesI18n(options, done){

    var fs = require('fs');
    var files = options.src || [];

    var languages = options.languages || [];
    var territories = options.territories || [];

    var fallbackLanguage = options.fallbackLanguage;
    var fallbackTerritory = options.fallbackTerritory;

    var keys = {};

    var mapOfLangTerr = {};

    var parsePath = require('./parsePath');

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

        if (!mapOfLangTerr[lang]) {
            mapOfLangTerr[lang] = {};
        }
        if(!mapOfLangTerr[lang][terr]){
            mapOfLangTerr[lang][terr] = {};
        }
        mapOfLangTerr[lang][terr] = extendKeys(mapOfLangTerr[lang][terr], data);
    }

    function handleTerritoryFallback(lang, terr) {
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

    function handleMissingKeys(lang, key, terr) {
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

    function handleKeyFallback(lang, terr, key) {
        //handle missing languages
        if (!mapOfLangTerr[lang]) {
            mapOfLangTerr[lang] = clone(mapOfLangTerr[fallbackLanguage]);
        }

        //handle territory fallback
        if (!mapOfLangTerr[lang][terr]) {
            handleTerritoryFallback(lang, terr);
        }

        //handle missing keys
        if (!mapOfLangTerr[lang][terr][key]) {
            handleMissingKeys(lang, key, terr);
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

    function readFile(path){
        return JSON.parse(fs.readFileSync(path));
    }


    (function main(){

        forEachFileLangTerr(function iterateFile(file, lang, terr){
            var path = parsePath(file.path, lang, terr);

            try {
                var data = nameSpaceFile(readFile(path), file.namespace);
                setMemory(lang, terr, data);
                determineKeys(data);
            }
            catch(e){}

        });

        getMemory(fallbackLanguage, fallbackTerritory);

        territories.forEach(function iterateTerr(terr){
            getMemory(fallbackLanguage, terr);
        });

        languages.forEach(function iterateLangs(lang){
            getMemory(lang, fallbackTerritory);
        });

        forEachLangTerr(function iterateLangsTerr(lang, terr){
            getMemory(lang, terr);
        });

        done(mapOfLangTerr);
    })();

};