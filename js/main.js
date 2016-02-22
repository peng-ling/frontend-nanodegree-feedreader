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

  //
  //filter the items using the filter text
  self.filterLocations = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter || filter === ' ') {
      return self.Locations();
      console.console.log('gashjdgashdg');
    } else {
      return self.Locations().filter(function(item) {
        return RegExp(filter).test(item.name.toLowerCase());
      });
    };
  });
};

ko.applyBindings(new locationsViewModel());

function initMap() {

  var myLatLng = {
    lat: 50.0716683,
    lng: 8.2309231
  };

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 8
  });

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Hello World!'
  });
}
