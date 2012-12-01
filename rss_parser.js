var feedparser = require('feedparser'),
	partial = require('./utility_scripts').partial;



var city = 'sfbay';
var min = 0;
var max = 5000;
var q = '1999%20honda%20accord';



function clScraper (  ) {

	this.now = new Date();
	this.last_scrape_date = Date.parse('Thu Nov 29 2012 16:17:46 GMT-0800 (PST)');

}

clScraper.prototype = {

	'get_it' : function ( callback ) {

		var self = this;

		feedparser
			.parseUrl( 'http://'+city+'.craigslist.org/search/sss?minAsk='+min+'&maxAsk='+max+'&query='+q+'&srchType=T&format=rss' )
			.on('article', extract);

		function extract ( article ) {

			if ( article.date > self.last_scrape_date ) {
				callback( article );
			}
		}

	}

};

var shit_hair = new clScraper();

shit_hair.get_it(function ( farts ) {
	console.dir( farts );
});