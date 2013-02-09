$(function() {

    var email_pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/);

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
            $_elem.find('.results').append( '( ' + obj.results.length + ' )');
            $_elem.find('.min').append( obj.min );
            $_elem.find('.max').append( obj.max );

            if ( obj.cities ) {
                var $_cities = $_elem.find('.cities');

                for ( var i=0, c=obj.cities.length; i < c; i++) {
                    if ( i > 0 ) $_cities.append( ", " );
                    $_cities.append( obj.cities[i] );
                }
            }

            if ( obj.results ) {
                var $_results = $_elem.find('.results').find('.r_l');

                for ( var i=0, c=obj.results.length; i < c; i++) {
                    // if ( i > 0 ) $_results.append( ", " );
                    $_results.append( '<li><a href=\"' + obj.results[i].link + '\">' + obj.results[i].title + '</a></li>' );
                }
            }
            
            $_elem.find('input.listing_id').val( obj._id );
            $_elem.find('button').attr( 'id', obj._id );
            $_elem.find('a.show_result_list').attr( 'data-listing-id', obj._id );
            
            $_listings.append( $_elem );
        }
    }

    function clear_form( $_elem ) {

        var options = $_elem.find( "select[name=listing_cities]" ).children('option');
        
        options.each(function (opt) {
            $(this).context.selected = false;
        });

        var user_id = $_elem.find( "input[name=user_id]" ).val();

        $_elem.find( "input[type!=submit]" ).val('');
        $_elem.find( "input[name=user_id]" ).val( user_id );
        
    }

    function new_from_template( $_elem ) {
        return $_elem.clone().removeClass('template');
    }

    function find_form( name ) {
        return $("form[name=" + name + "]");
    }



    var manager = new Manager( $_listings ),
        listing_form = find_form('listings'),
        admin_form = find_form('admin'),
        user_id = listing_form.find('input[name=user_id]').val();


    $.get("/api/listings/" + user_id, function(data, textStatus, jqXHR) {
        //console.log("Get resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
        for( key in data ) {
            manager.append( data[key] );
        }
    });

	listing_form.find('button').on('click', function( event ) {
    	
    	event.preventDefault();

        var $_elem = $(this).parents('form');

        var name = $_elem.find( "input[name=listing_name]" ).val(),
            type = $_elem.find( "select[name=listing_type]" ).val(),
            min = $_elem.find( "input[name=listing_min]" ).val(),
            max = $_elem.find( "input[name=listing_max]" ).val(),
            cities = $_elem.find( "select[name=listing_cities]" ).val(),
            uid = $_elem.find( "input[name=user_id]" ).val();

        var new_listing = { 'user_id': uid, 'type': type, 'name': name, 'min': min, 'max': max, 'cities': cities };

        $("tr#roading").html("<td colspan='4'><div class='alert'>Saving...</div></td>").fadeIn();

        $.post("/api/listings", new_listing, function(data, textStatus, jqXHR) {
            console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            $('tr#roading').fadeOut().html('');

            manager.append( data );
        }).fail(function () {

            $("tr#roading").html("<td colspan='4'><div class='alert alert-error'>Error Saving...</div></td>");

            window.setTimeout(function () {
                $('tr#roading').fadeOut().html('');
            }, 3000);

        });

        clear_form( $_elem );

        return false;
	});

    admin_form.on('click', 'button', function ( ev ) {

        ev.preventDefault();

        var $_elem = $(this).parents('form'),
            container = $(this).parents('#admin_form'),
            email = $_elem.find( "input[name=email]" ).val();


        $.post("/update/" + user_id, { 'email': email }, function(data, textStatus, jqXHR) {

            container.fadeOut(300).html('');

            window.setTimeout(function () {
                container.html('thanks!<hr>').fadeIn();
            }, 500);

        });

    });


    // LOTS OF COPYPASTA EVERYWHERE --- REFACTOR THIS SHIT, MAN --- 


    var del_forms = $('form.edit_listing');

    $_listings
        .on('click', 'button.del', function ( event ) {

            event.preventDefault();

            var _id = $(this).attr('id');

            var p = $(this).parents('tr');

            p.css('color', '#bbb');
            p.css('background', '#eee');
            $(this).addClass('disabled').off('click');

            $.post("/api/listings/"+_id, _id, function(data, textStatus, jqXHR) {
                //console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
                if( data._id && data._id == _id ) { p.fadeOut(); }
            });

        })
        .on('click', 'button.view', function ( event ) {
            
            event.preventDefault();

            var this_listing = $(this).parents('tr'),
                toitle = this_listing.find('.name').html(),
                links = this_listing.find('.r_l');

            $('#resultsModal').html( toitle + ' - <em>latest results:</em>' );

            links.clone().removeClass('hide').appendTo('#results_modal_list');

            $('#results_modal').modal('show');
        });

    $('#results_modal').on('hidden', function () {
        $('#results_modal_list').html( '' );
    });

    $('#are_you_cool').on('click', 'button', function ( ev ) {

        ev.preventDefault();

        var parent = $(this).parents('#are_you_cool'),
            name = parent.find('input[name=name]').val(),
            key = parent.find('input[name=key]').val();

        $.post("/" + name, { 'key': key }, function(data, textStatus, jqXHR) {

            // console.log("Post resposne:"); console.dir(data); console.log(textStatus); console.dir(jqXHR);
            parent.html(data);

        }).fail(function () {

            parent.html("<div class='alert alert-error'>NOPE</div>");

        });

    });
    
});