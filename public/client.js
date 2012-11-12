$(function() {

    window.addEventListener('message', function(e) {
        var data = e.data;
        console.log(data);
    }, false);

    function Manager( element ) {
        this.element = element;
    }
    Manager.prototype = {
        'save': function( callback ) {
            callback( this );
        },
        'append': function( obj ) {
            var elem = $_listing.clone().removeClass('template');

            elem.find('.name').append( obj.name );
            elem.find('.type').append( obj.type );
            
            $_listings.append( elem );
        }
    }

	// $_name denotes that name is an HTMLElement
	var $_listings = $('.listings').find('ul'),
        $_listing = $_listings.find('.template'),
        manager = new Manager( $_listings );


    $.get("/api/listings", function(data, textStatus, jqXHR) {
        //console.log("Get resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
        for( key in data ) {
            manager.append( data[key] );
        }
    });

	$("form[name=add_listing]").on('submit', function( event ) {
    	
    	event.preventDefault();

        var name = $(this).find( "input[name=listing_name]" ).val(),
            type = $(this).find( "input[name=listing_type]" ).val(),
            min = $(this).find( "input[name=listing_min]" ).val(),
            max = $(this).find( "input[name=listing_max]" ).val();

        var new_listing = { 'type': type, 'name': name, 'min': min, 'max': max };

        $.post("/api/listings", new_listing, function(data, textStatus, jqXHR) {
            //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            manager.append( data );
        });
	});
});