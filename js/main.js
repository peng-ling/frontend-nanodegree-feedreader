function locationsViewModel() {
  var self = this;

  self.locations = ko.observableArray([{
    Name: 'Bert'
  }, {
    Name: 'Charles'
  }, {
    Name: 'Denise'
  }]);

  //http://stackoverflow.com/questions/20857594/knockout-filtering-on-observable-array
  self.currentFilter = ko.observable();

  self.filterLocations = ko.computed(function() {
    if (!self.currentFilter()) {
      return self.locations();
    } else {
      return ko.utils.arrayFilter(self.locations(), function(locations) {
        return locations.Name == self.currentFilter();
      });
    }
  });

  self.filter = function(Name) {
    self.currentFilter(Name);
  }

}

ko.applyBindings(new locationsViewModel);

function initMap() {
  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.397,
      lng: 150.644
    },
    scrollwheel: false,
    zoom: 8
  });
}
