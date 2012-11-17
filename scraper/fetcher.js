var request = require('request');

function Fetcher( base_url ) {

	this.base = base_url;
	this.list = [];
}
Fetcher.prototype = {

	'fetch': function ( resource, callback ) {
		
		var self = this;

		request(self.base + resource, callback);

	}
};

module.exports = Fetcher;