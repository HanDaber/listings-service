var Browser = require("zombie");

// Load the page from localhost
browser = new Browser()
browser.visit("https://accounts.craigslist.org/", function (err, bro) {
	console.log('fuh ' + bro.html());
  // Fill email, password and submit form
  bro.
    fill("inputEmailHandle", "handaber@gmail.com").
    fill("inputPassword", "madmka").
    pressButton("Log In", function() {

      // Form submitted, new page loaded.
      console.dir(bro.html());

    })

});