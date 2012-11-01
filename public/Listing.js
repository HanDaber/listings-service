var Listing = (function () {
    function Listing(e, n) {
        if (typeof n === "undefined") { n = ''; }
        this.name = n;
        this.element = e;
    }
    Listing.prototype.greet = function () {
        return "Hello, " + this.name;
    };
    Listing.prototype.add = function () {
        alert('added ' + this.name);
        return this;
    };
    Listing.prototype.save = function (callback) {
        $.getJSON('listings', function (data) {
            if(data['save'] === 'success' && callback && typeof (callback) === 'function') {
                console.log('save is a success!');
            }
        });
        return this;
    };
    Listing.prototype.show = function (context) {
    };
    return Listing;
})();
exports.Listing = Listing;

