var feedparser = require('feedparser'),
	Listing = require('./scraper_modules/listing'),
	Result = require('./scraper_modules/result').model;//,
	// partial = require('./utility_scripts').partial;



var city = 'sfbay';
var min = 0;
var max = 5000;
var q = '1999%20honda%20accord';



function rssScraper (  ) {

	// this.now = new Date();
	// this.last_scrape_date = Date.parse('Fri Nov 30 2012 16:17:46 GMT-0800 (PST)');

}

rssScraper.prototype = {

	'article' : function ( callback ) {

		var self = this; // this should be a Listing object

		feedparser
			.parseUrl( 'http://'+city+'.craigslist.org/search/sss?minAsk='+self.min+'&maxAsk='+self.max+'&query='+self.name+'&srchType=T&format=rss' )
			.on('article', extract);

		function extract ( article ) {

			if ( article.date > self.last_scraped ) {

				var r = new Result({
					'title' : article.title,
					'url' : article.link,
					'date' : article.date
				});

				// self.results.push( r );
				// self.save();
				
				callback( r );
			}
		}

	}

};

module.exports = rssScraper;
/*var rss_scraper = new rssScraper();

rss_scraper.article(function ( article ) {
	var r = new Result({
		'title' : article.title,
		'url' : article.link,
		'date' : article.date
	});
	console.dir( r.title );
});*/