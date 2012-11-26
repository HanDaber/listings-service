var feedparser = require('feedparser');

feedparser.parseUrl('http://sfbay.craigslist.org/search/sss?maxAsk=5&query=1999%20honda%20accord&srchType=T&format=rss').on('article', show);

function show ( article ) {

	var now = new Date(),
		last_scrape_date = Date.parse('Mon Nov 19 2012 08:17:46 GMT-0800 (PST)');

	if ( article.date > last_scrape_date ) {
		console.log('scraped ' + now + ', posted ' + article.date);
	}
}