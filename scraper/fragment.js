function Fragment() {
	this.list = [];
	this.count = 0;
}
Fragment.prototype = {
	'collect': function( scraper ) {

		var self = this,
			size = scraper.urls.length;

		scraper.scrape( extract ); // scraper.scrape

		function extract (err, $) {
			if(err) {
				console.log(err);
			} else {

				$('p.row').each(function(index, elem) {
					self.list.push('<div>'+ $(this).text() +'</div>');
				});

				self.count ++;
			}
		}
	}
};

module.exports = Fragment;