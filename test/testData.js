/**
 * Created by daniel.irwin on 6/6/16.
 */

describe('Test Aggregation In Memory', function () {

    var assert = require('assert-diff').deepEqual;
    var deep = require('deep-value');

    var memory = true;
    //run
    var languages = ['en', 'nb', 'un'];
    var territories = ['US', 'GB', 'NO', 'yu', 'ZH'];


    require('../aggregateFilesi18n')({
        fallbackLanguage: 'en',
        fallbackTerritory: 'US',
        languages: languages,
        territories: territories,
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
    }, function (data) {




        it('all keys show up in all files', function(){
            var langs = languages.sort();
            assert(langs, ['en', 'nb', 'un'], 'languages were not sorted properly in test');

            var terrs = territories.sort();
            assert(terrs, ['GB', 'NO', 'US', 'ZH', 'yu'], 'territories were not sorted properly in test');

            assert(Object.keys(data).sort(),langs);

            assert(Object.keys(data.en).sort(),terrs, 'data.en');
            assert(Object.keys(data.un).sort(),terrs, 'data.un');
            assert(Object.keys(data.nb).sort(),terrs, 'data.nb');

        });

        it('UnYun should be english', function () {

            assert(deep(data, 'un.yu'), {
                testUSKey: 'EN_US', //en_US
                testdata: 'enUS', //enUS
                testgbKey: 'fallback',
                testZHKey: 'fallback',
                testNOkey: 'fallback',
                oneoneKey: 'oneValue',
                onedata: 'fallback',
                onegbKey: 'fallback'
            });
        });

        it('nbGB is nbUS', function () {
            assert(deep(data, 'en.GB'), {
                testgbKey: 'EN_GB',
                testdata: 'enGB',
                testUSKey: 'EN_US', //this guy
                testZHKey: 'fallback',
                testNOkey: 'fallback',
                oneoneKey: 'oneValue',
                onedata: 'fallback',
                onegbKey: 'fallback'
            });

        });

        it('nbNO is nbNO', function () {
            assert(deep(data, 'nb.NO'), {
                testNOkey: 'NB_NO',
                testdata: 'nbNO',
                testUSKey: 'EN_US',
                testgbKey: 'fallback',
                testZHKey: 'fallback',
                oneoneKey: 'oneValue',
                onedata: 'fallback',
                onegbKey: 'fallback'
            });
        });

        it('enUS is enUS', function () {

            assert(deep(data, 'en.US'), {
                testUSKey: 'EN_US',
                testdata: 'enUS',
                testgbKey: 'fallback',
                testZHKey: 'fallback',
                testNOkey: 'fallback',
                oneoneKey: 'oneValue',
                onedata: 'fallback',
                onegbKey: 'fallback'
            });

        });


        it('zh territory should fallback to language', function () {

            assert(deep(data, 'en.ZH'), {
                testZHKey: 'EN_ZH',
                testdata: 'enZH',
                testUSKey: 'EN_US',
                testgbKey: 'fallback',
                testNOkey: 'fallback',
                oneoneKey: 'oneValue',
                onedata: 'fallback',
                onegbKey: 'fallback'
            });

            assert(deep(data, 'nb.ZH'), {
                testZHKey: 'NB_ZH',
                testdata: 'nbZH',
                testUSKey: 'EN_US',
                testgbKey: 'fallback',
                testNOkey: 'fallback',
                oneoneKey: 'oneValue',
                onedata: 'fallback',
                onegbKey: 'fallback'
            });

        });

    });

});

