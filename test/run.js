/**
 * Created by daniel.irwin on 6/6/16.
 */

describe('Test Aggregation In Memory', function () {

    var memory = true;
    //run
    require('../aggregateFilesi18n')({
        fallbackLanguage: 'en',
        fallbackTerritory: 'US',
        languages: ['en', 'nb', 'un'],
        territories: ['US', 'GB', 'NO', 'yu', 'ZH'],
        src: [
            {
                namespace: 'test',
                path: './test/src/{{language}}/{{territory}}/test.json'
            },
            {
                namespace: 'one',
                path: './test/other/{{language}}{{territory}}.json'
            }
        ],
        dest: './test/dest/l10n/{{language}}_{{territory}}.json',
        keepInMemory: memory
    }, function () {

        var enGB = require('./dest/l10n/en_GB.json');
        var enUS = require('./dest/l10n/en_US.json');
        var enZH = require('./dest/l10n/en_ZH.json');
        var nbNO = require('./dest/l10n/nb_NO.json');
        var nbZH = require('./dest/l10n/nb_ZH.json');

        var unyun = require('./dest/l10n/un_yu.json');

        it('all keys show up in all files', function(){

        });

        it('UnYun should be english', function () {

        });

        it('nbGB is nbUS', function () {

        });

        it('nbNO is nbNO', function () {

        });

        it('enUS is enUS', function () {

        });

    });

});

