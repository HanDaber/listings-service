var sanitizer = require('sanitizer');

function Fragment() {
	this.list = "";
	this.count = 0;

	this.months = ["Jan", "Feb", "Mar", 
"Apr", "May", "Jun", "Jul", "Aug", "Sep", 
"Oct", "Nov", "Dec"];
	this.now = new Date();
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

				$('p.row').slice(0, 5).each(function(index, elem) { // limit to 5 elements per page

					var $_this = $(this);

					var html = sanitizer.sanitize( $_this.text() );

					// if ( self.is_new( html ) ) {
					if ( 1 ) {

						var link = $_this.find('a').first().attr('href');

						self.list += "<p>";
						self.list += "<div style=" + "\"background:#eee;padding:8px;mragin-top:8px;border-bottom:1px solid #bbb\"" + ">";
						self.list += "<a href=\"" + link + "\">" + html + "</a>";
						self.list += "</div>";
						self.list += "</p>";
					}
				});

				self.count ++;
			}
		}
	},

	'compress': function() {
		return this.list.replace(/(\r\n|\n|\r|\t|\s+)+/gm, ' ');
	},

	'is_new': function( str ) {
		var recent = " " + this.months[this.now.getMonth()] + " ";

		if ( str.indexOf( ""+recent+this.now.getDate() ) != -1 ) { return true; }
		else if ( str.indexOf( ""+recent+(this.now.getDate()-1) ) != -1 ) { return true; }
		else if ( str.indexOf( ""+recent+(this.now.getDate()-2) ) != -1 ) { return true; }
		else { return false; }
	}
};

module.exports = Fragment;