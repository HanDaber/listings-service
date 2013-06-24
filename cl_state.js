var http = require('http'),
	jsdom = require('jsdom'),
	fs = require('fs-extra'),
    async = require('async');

var state_abbrs = ['al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'dc', 'de', 
            'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 
            'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'nc', 'nh', 
            'ne', 'nv', 'nj', 'nm', 'ny', 'nd', 'oh', 'ok', 'or', 'pa', 
            'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 
            'wi', 'wy'];

async.map( state_abbrs, get_state, save_states );


function get_state ( abbr, next ) {

    var options = {
        host: 'geo.craigslist.org',
        path: '/iso/us/' + abbr
    };

    http.request(options, function ( response ) {

        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {

            var state = {};

            state.name = abbr;
            state.cities = [];

            if(str.length > 0) {
                jsdom.env({ html: str, scripts: ['./public/js/jquery-1.9.1.min.js'] }, function ( err, window ) {

                    var $ = window.jQuery;

                    var links = $('#list').find('a');

                    console.log(links.length + ' links found for ' + state.name)

                    links.each(function () {
                        var href = $(this).attr('href'),
                            text = $(this).text();

                        var city = {
                            name: text,
                            slug: href.replace('http://', '').replace('.craigslist.org/', '')
                        };

                        state.cities.push( city );
                    });
                });
            }

            next( null, state );
        });
    }).end();

}

function save_states ( err, states ) {
    if(err)console.log(err);
    else {
        console.log('saving.....................................................................................')
        fs.writeJson('./public/usa.json', states, function(err){
            if(err)console.log(err);
            else console.log('saved states');
        });
    }
}


function extract_state ( state ) {
    return function ( res ) {
        jsdom.env({ 
            html: res,
            scripts: ['./public/js/jquery-1.9.1.min.js']
        }, function ( err, window ) {

            var $ = window.jQuery;

            var links = $('#list').find('a'),
                cities = [];

            links.each(function () {
                var href = $(this).attr('href'),
                    text = $(this).text();

                var city = {
                    name: text,
                    slug: href.replace('http://', '').replace('.craigslist.org/', '')
                };

                cities.push( city );
            });
        });
    }
}
