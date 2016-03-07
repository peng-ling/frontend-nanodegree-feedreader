var map;
var wiki;

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
    zoom: 12
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
    wikipageid: 26496842
  }, {
    name: "Restaurant Mykonos",
    lating: {
      lat: 50.0723748,
      lng: 8.2292886
    },
    description: "great greek food",
    /*icon: '',*/
    visible: true,
    wikipageid: 26496842
  }, {
    name: "Asso",
    lating: {
      lat: 50.0723748,
      lng: 8.2592886
    },
    description: "Asso",
    /*icon: '',*/
    visible: true,
    wikipageid: 16095
  }, {
    name: "Nerobergbahn",
    lating: {
      lat: 50.0946675,
      lng: 8.2210174
    },
    description: "Nerobergbahn",
    /*icon: '',*/
    visible: true,
    wikipageid: 9672198
  }];

  //intializing marker array

  this.locationsViewModel = function() {

    var self = this;

    self.Locations = ko.observableArray(places);

    self.filter = ko.observable('');

    self.placesmarker = ko.observableArray([]);

    places.forEach(function(item) {
      self.placesmarker.push(new google.maps.Marker({
        position: item.lating,
        map: map,
        title: item.name,
        label: item.name
      }));
    });
    console.log('PM: ' + self.placesmarker());

    self.filteredplacesmarker = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter || filter === '') {
        return self.placesmarker();
      } else {
        self.placesmarker().forEach(function(item) {
          if (RegExp(filter).test(item.title.toLowerCase())) {
            console.log('true filter:' + filter + ' item: ' + item.title);
            item.setVisible(true);
            console.log(item);
          } else {
            console.log('false filter:' + filter + ' item: ' + item.title);
            item.setVisible(false);
          }
        });
      }
      console.log('------------------');
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

    $(document).ready(function() {
      $.ajaxPrefilter("json script", function(options) {
        options.crossDomain = true;
      });
      $.ajaxSetup({
        dataType: "json"
      });
      $.ajax({
        type: "GET",
        //action=query&prop=extracts
        url: "https://en.wikipedia.org/w/api.php?format=json&action=query&titles=Jimi_Hendrix|Nerobergbahn|Hessisches_Staatstheater_Wiesbaden|Wilhelmstraße_(Wiesbaden)&prop=extracts&exlimit=max&explaintext&exintro",
        //url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=Jimi_Hendrix|Eddie_Van_Halen",
        //url: "https://crossorigin.me/https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Jimi_Hendrix",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "jsonp",
        success: function(data, textStatus, jqXHR) {
          console.log(data);
          for (var k in data.query.pages) {
            self.placesmarker().forEach(function(item) {
              console.log('Marker: ' + item.title + ' wiki: ' + data.query.pages[k].title);
            });
          }
        },
        error: function(errorMessage) {
          console.log(errorMessage);
        }
      });
    });
  };

  ko.applyBindings(new locationsViewModel());



};
