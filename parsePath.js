/**
 * Created by daniel.irwin on 6/23/16.
 */
module.exports = function parsePath(path, language, territory){
    var langRegex = /\{\{language\}\}/g;
    var territoryRegex = /\{\{territory\}\}/g;

    var result = path.replace(langRegex, language).replace(territoryRegex, territory);
    //console.log('', result, arguments);
    return result;
};
