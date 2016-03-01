var map;

var callbackGM = function() {

  if (typeof google == 'undefined') {
    nm('error');
  } else {
    initMap();
    nm('ok');
  }
};

var initMap = function() {

  var myLatLng = {
    lat: 50.0716683,
    lng: 8.2309231
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 8
  });
};

var nm = function(state) {

  this.state = state;

  var places = [{
    name: "Ristorante Pizzeria Da Balbi",
    lating: {
      lat: 50.0720994,
      lng: 8.2317455
    },
    description: "great italian food",
    /*icon: '',*/
    visible: true,
    filterstatus: ''
  }, {
    name: "Restaurant Mykonos",
    lating: {
      lat: 50.0723748,
      lng: 8.2292886
    },
    description: "great greek food",
    /*icon: '',*/
    visible: true,
    filterstatus: ''
  }, {
    name: "Asso",
    lating: {
      lat: 50.0723748,
      lng: 8.3592886
    },
    description: "Asso",
    /*icon: '',*/
    visible: true,
    filterstatus: ''
  }, {
    name: "Zorro",
    lating: {
      lat: 50.0723748,
      lng: 8.3592886
    },
    description: "Zorro",
    /*icon: '',*/
    visible: true,
    filterstatus: ''
  }];

  //intializing marker array

  var locationsViewModel = function() {

    var self = this;

    self.Locations = ko.observableArray(places);

    self.filter = ko.observable('');

    self.placesmaker = ko.observableArray([]);

    places.forEach(function(item) {
      self.placesmaker.push(new google.maps.Marker({
        position: item.lating,
        map: map,
        title: item.name
      }));
    });

    self.filteredplacesmaker = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter || filter === '') {
        return self.placesmaker();
      } else {
        self.placesmaker().forEach(function(item) {
          if (RegExp(filter).test(item.title.toLowerCase())) {
            item.setVisible(true);
          } else {
            item.setVisible(false);
          }
        });
      }
    });

    self.filterLocations = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter || filter === '') {
        return self.Locations();
      } else {
        return self.Locations().filter(function(item) {
          return RegExp(filter).test(item.name.toLowerCase());
        });
      }
    });

    self.filterLocations.subscribe(function(newitem) {});
  };

  ko.applyBindings(new locationsViewModel());

};
