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

    it('writes files', function(done){

        this.timeout(10000);

        require('../aggregateFilesi18n')({
            fallbackLanguage: 'en',
            fallbackTerritory: 'US',
            languages: languages,
            territories: territories,
            src: [
                {
                    namespace: 'test',
                    path: './src/{{language}}/{{territory}}/test.json'
                },
                {
                    namespace: 'one',
                    path: './other/{{language}}{{territory}}.json'
                }
            ],
            dest: './dest/l10n/{{language}}_{{territory}}.json',
            keepInMemory: memory
        }, function(data){
            require('../writeFile')('./dest/l10n/{{language}}_{{territory}}.json', data, function(){

                require('./dest/l10n/en_GB.json');
                require('./dest/l10n/en_NO.json');
                require('./dest/l10n/en_US.json');
                require('./dest/l10n/en_yu.json');
                require('./dest/l10n/en_ZH.json');

                require('./dest/l10n/nb_GB.json');
                require('./dest/l10n/nb_NO.json');
                require('./dest/l10n/nb_US.json');
                require('./dest/l10n/nb_yu.json');
                require('./dest/l10n/nb_ZH.json');

                require('./dest/l10n/un_GB.json');
                require('./dest/l10n/un_NO.json');
                require('./dest/l10n/un_US.json');
                require('./dest/l10n/un_yu.json');
                require('./dest/l10n/un_ZH.json');

                setTimeout(done, 300);


            });
        });

    });

});

