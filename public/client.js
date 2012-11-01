function Listing( l ) {
    this.name = l.name;
}
Listing.prototype.save = function( callback ) {
    callback( this );
}

// Cross domain requests
function xdr( uri, callback ) {  
/*    // Pass a defined function to prevent cache-busting.  
    $.getJSON( uri, xdr_callback );  
    
    function xdr_callback(data) {
        callback( data );
    }*/
    $.ajax({
        dataType: 'jsonp',
        // data: "somedata=blahblah",
        jsonp: 'callback',
        url: uri,
        success: callback
    });
}  

$(function() {

	// $_name denotes that name is an HTMLElement
	var $_listings = $('.listings').find('ul'),
        $_listing = $_listings.find('.template');

    xdr("http://listings-service.herokuapp.com/api/listings", function( data ) {
        for( key in data ) {
            $_listing.clone().removeClass('template').find('.name').append( data[key].name ).appendTo( $_listings );
        }
    });

/*    $.getJSON("http://listings-service.herokuapp.com/api/listings", function(data, textStatus, jqXHR) {
        console.log("Get resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
        for( key in data ) {
            $_listing.clone().removeClass('template').find('.name').append( data[key].name ).appendTo( $_listings );
        }
    });*/

	$("form[name=add_listing]").on('submit', function( event ) {
    	
    	event.preventDefault();

    	var listing_name = $(this).find( "input[name=listing_name]" ).val();

        $.post("http://listings-service.herokuapp.com/api/listings", { "name": listing_name }, function(data, textStatus, jqXHR) {
            console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
        });
	});
});