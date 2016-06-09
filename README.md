# grunt-aggregate-i18n

    //run
    require('grunt-aggregate-i18n')(grunt);

    grunt.initConfig( "grunt-aggregate-i18n" : {
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
        dest: './test/dest/l10n/{{language}}_{{territory}}.json'
    });


       all keys show up in all files

        UnYun should be english

        nbGB is nbUS

        nbNO is nbNO

        enUS is enUS

