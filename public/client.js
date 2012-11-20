$(function() {

    // $_name denotes that name is an HTMLElement
    var $_listings = $('.listings').find('tbody'),
        $_listing = $_listings.find('.template');

    // Define the Manager object
    function Manager( element ) {
        this.element = element;
    }
    Manager.prototype = {
        'save': function( callback ) {
            callback( this );
        },
        'append': function( obj ) {
            var $_elem = new_from_template( $_listing );

            $_elem.find('.name').append( obj.name );
            $_elem.find('.type').append( obj.type );
            $_elem.find('.min').append( obj.min );
            $_elem.find('.max').append( obj.max );
            $_elem.find('input.listing_id').val( obj._id );
            
            $_listings.append( $_elem );
        }
    }

    function clear_form( $_elem ) {
        $_elem.find( "input[type!=submit]" ).val('');
    }

    function new_from_template( $_elem ) {
        return $_elem.clone().removeClass('template');
    }

    function find_form( name ) {
        return $("form[name=" + name + "]");
    }



    var manager = new Manager( $_listings ),
        listing_form = find_form('listings'),
        cities_form = find_form('cities'),  // <=== ehhh....
        $_cities = cities_form.find('ul');

    $.get("/api/listings", function(data, textStatus, jqXHR) {
        //console.log("Get resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
        for( key in data ) {
            manager.append( data[key] );
        }
    });

	listing_form.find('button').on('click', function( event ) {
    	
    	event.preventDefault();
        var $_elem = $(this).parent();

        var name = $_elem.find( "input[name=listing_name]" ).val(),
            type = $_elem.find( "select[name=listing_type]" ).val(),
            min = $_elem.find( "input[name=listing_min]" ).val(),
            max = $_elem.find( "input[name=listing_max]" ).val();

        var new_listing = { 'type': type, 'name': name, 'min': min, 'max': max };

        $.post("/api/listings", new_listing, function(data, textStatus, jqXHR) {
            //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            manager.append( data );
        });

        clear_form( $_elem );

        return false;
	});


    // LOTS OF COPYPASTA EVERYWHERE --- REFACTOR THIS SHIT, MAN --- 

    $.get("/api/cities", function(data, textStatus, jqXHR) {
        for( key in data ) {
            $_cities.append('<li>'+ data[key].name +'</li>');
        }
    });

    cities_form.on('submit', function( event ) {
        
        event.preventDefault();
        var $_elem = $(this);

        var name = $_elem.find( "input[name=city_name]" ).val();

        var new_city = { 'name': name };

        $.post("/api/cities", new_city, function(data, textStatus, jqXHR) {
            //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            $_cities.append('<li>'+ data.name +'</li>');
        });

        clear_form( $_elem );

        return false;
    });
    
});