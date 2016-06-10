# grunt-aggregate-i18n
Aggregate i18n/l10n map string files into one file per brand/territory

[![npm version](https://badge.fury.io/js/grunt-aggregate-i18n.svg)](https://badge.fury.io/js/grunt-aggregate-i18n) [![dependencies](https://david-dm.org/arupex/grunt-aggregate-i18n.svg)](http://github.com/arupex/grunt-aggregate-i18n) ![Build Status](https://api.travis-ci.org/arupex/grunt-aggregate-i18n.svg?branch=master) <a href='https://pledgie.com/campaigns/31873'><img alt='Pledge To Arupex!' src='https://pledgie.com/campaigns/31873.png?skin_name=chrome' border='0' ></a>

Install

    npm install grunt-aggregate-i18n --save-dev

Usage:

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

See Test (In-Progress)