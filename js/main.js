//google maps start
var initMap = function() {

  var myLatLng = {
    lat: 50.0716683,
    lng: 8.2309231
  };
  //https://addyosmani.com/resources/essentialjsdesignpatterns/book/#mixinpatternjavascript
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 8
  });

  // wait for loaded and add markers
  google.maps.event.addListener(map, 'idle', function() {
    console.log('LOADED');
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
  return this;
};
//google maps end

var xxx = function() {
  this.yyy = 'yyy';
  initMap.call(this);
};

xxx.prototype = Object.create(initMap.prototype);

var fireMap = function() {
  return fff = new xxx();
};

var places = [{
  name: "Ristorante Pizzeria Da Balbi",
  lat: 50.0716683,
  lng: 8.2309231,
  description: "great italian food",
  /*icon: '',*/
  visible: true
}, {
  name: "Restaurant Mykonos",
  lat: 50.0716683,
  lng: 8.2309231,
  description: "great greek food",
  /*icon: '',*/
  visible: true
}];

var locationsViewModel = function() {

  var self = this;

  self.Locations = ko.observableArray(places);

  self.filter = ko.observable('');

  self.filterLocations = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter || filter === '') {
      return self.Locations();
    } else {
      return self.Locations().filter(function(item) {
        return RegExp(filter).test(item.name.toLowerCase());
      });
    };
  });
};

ko.applyBindings(new locationsViewModel());
