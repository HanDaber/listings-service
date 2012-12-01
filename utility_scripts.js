var fs = require('fs'),
	jsdom = require('jsdom'),
	request = require('request'),
	_ = require('underscore'),
	jQuery = require('jQuery');

function write_file ( name, contents, callback ) {
	fs.writeFile( "./" + name, contents, callback ); // callback(err)
}

function http_req ( req_uri, callback ) {

	request({ uri: req_uri }, function ( err, response, body ) {
		if( err || response.statusCode !== 200 ) { console.log('Request error: ' + err) }
		else { callback( body ) }
	});
}

function handle_response ( body, callback ) {
		
	//Send the body param as the HTML code we will parse in jsdom
	jsdom.env({ html: body, scripts: [] }, function ( err, window ) {
		if ( err ) { console.log('jsdom error: ' + err) }
		else { callback( window ) }
	});
}

function handle_html ( window ) {

	// bind jquery to window
	var $ = jQuery.create( window );

	var country_divs = $('.colmask'),
		state_divs = $('.colleft').children('div');

	$.each( country_divs, function (index) {
		console.log( $(this).text() );
	});
}

function partial ( fn /* , args... */ ) {
	var slice = Array.prototype.slice;

	var args = slice.call( arguments, 1 );

	return function() {
		// original args last
		var allArguments = slice.call( arguments ).concat( args );

		return fn.apply(this, allArguments);
	};
}

function base_uri ( city ) {
	return 'http://' + city + '.craigslist.org/';
}

var cities = ['sfbay', 'chico'],
	listings = [{a:'a'},{a:'b'}];

var handle = partial( handle_response, handle_html );

// http_req( 'http://www.craigslist.org/about/sites/', handle );


/*

[<city>, <city>] + base_uri => [<base_uri>, <base_uri>]

				 + <listing> => [<listing_uri>, <listing_uri>]

				 + scraper => async:[<html_doc>, <html_doc>]

				 + async:each => <html_doc>

				 + jQuery => [<html_element>, <html_element>]

				 + each => <html_element>

				 + accumulator => [<html_element>, <html_element>]

				 + formatter => <html_doc>

				 + mailer => done.

*/


/*

<listing>#scrape() -> ((this.cities => base_uris) => this.uris) => <html_doc>

*/





exports.partial = partial;

















