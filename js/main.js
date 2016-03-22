var map;
var wiki;
var weather;
var weatherAppendString;

var googleError = function() {
  $("#map").append('Unfortunately google map could not be loaded, try reloading the page.');

};



var callbackGM = function() {
  console.log(typeof google);

  if (typeof google === 'undefined') {
    nm('error');
  } else {
    initMap();
    nm('ok');
  }
};

var initMap = function() {

  var myLatLng = {
    lat: 50.0653546,
    lng: 8.2341895
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 13
  });
};

var nm = function(state) {
  var wikiTitelsForUrl = '';

  if (state === 'ok') {

    var places = [{
      name: "Hessisches Staatstheater Wiesbaden",
      lating: {
        lat: 50.0837223,
        lng: 8.2437581
      },
      description: "Hessisches Staatstheater Wiesbaden",
      /*icon: '',*/
      visible: true,
      wikipagetitle: "Hessisches Staatstheater Wiesbaden"
    }, {
      name: "Wilhelmstraße",
      lating: {
        lat: 50.082338,
        lng: 8.2425596
      },
      description: "Wilhelmstraße",
      /*icon: '',*/
      visible: true,
      wikipagetitle: "Wilhelmstraße (Wiesbaden)"
    }, {
      name: "Biebrich Palace",
      lating: {
        lat: 50.0373451,
        lng: 8.2319409
      },
      description: "Biebrich Palace",
      /*icon: '',*/
      visible: true,
      wikipagetitle: "Biebrich Palace"
    }, {
      name: "Nerobergbahn",
      lating: {
        lat: 50.0946675,
        lng: 8.2210174
      },
      description: "Nerobergbahn",
      /*icon: '',*/
      visible: true,
      wikipagetitle: "Nerobergbahn"
    }, {
      name: "Wiesbaden Hauptbahnhof",
      lating: {
        lat: 50.0709347,
        lng: 8.2412096
      },
      description: "Wiesbaden Main Station",
      /*icon: '',*/
      visible: true,
      wikipagetitle: "Wiesbaden Hauptbahnhof"
    }, {
      name: "St Elizabeth's Church",
      lating: {
        lat: 50.0976096,
        lng: 8.2325569
      },
      description: "St Elizabeth's Church",
      /*icon: '',*/
      visible: true,
      wikipagetitle: "St Elizabeth's Church, Wiesbaden"
    }, {
      name: "Kochbrunnen",
      lating: {
        lat: 50.0863564,
        lng: 8.239679
      },
      description: "Kochbrunnen",
      /*icon: '',*/
      visible: true,
      wikipagetitle: "Kochbrunnen"
    }, {
      name: "Opelbad",
      lating: {
        lat: 50.0976812,
        lng: 8.2299419
      },
      description: "Opelbad",
      /*icon: '',*/
      visible: true,
      wikipagetitle: "Opelbad"
    }];

    //wikimedia api titles string concatenation
    //Opelbad
    places.forEach(function(item, index) {
      if (places.length - index - 1 === 0) {
        wikiTitelsForUrl = wikiTitelsForUrl + item.wikipagetitle;
      } else {
        wikiTitelsForUrl = wikiTitelsForUrl + item.wikipagetitle + '|';
      }
    });

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
          label: item.wikipagetitle
        }));
      });

      //filter marker depending on input text value
      self.filteredplacesmarker = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter || filter === '') {
          self.placesmarker().forEach(function(item) {
            item.setVisible(true);
          });
        } else {
          self.placesmarker().forEach(function(item) {
            if (RegExp(filter).test(item.title.toLowerCase())) {
              item.setVisible(true);
            } else {
              item.setVisible(false);
            }
          });
        }
      });

      //filter places list in left panel
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

      //click on places list item invokes this function
      self.setPlace = function(pItem) {
        self.placesmarker().forEach(function(mItem) {
          if (pItem.name == mItem.title) {
            mItem.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
              mItem.setAnimation(null);
            }, 700);
          }
        });
      };

      $(document).ready(function() {
        $.ajaxPrefilter("json script", function(options) {
          options.crossDomain = true;
        });
        $.ajaxSetup({
          dataType: "json"
        });
        $.ajax({
          type: "GET",
          url: "https://en.wikipedia.org/w/api.php?format=json&action=query&titles=" + wikiTitelsForUrl + "&prop=extracts&exlimit=max&explaintext&exintro",
          contentType: "application/json; charset=utf-8",
          async: true,
          dataType: "jsonp",
          success: function(data, textStatus, jqXHR) {
            wiki = data;
            if (data.query.pages != 'undefined') {
              for (var k in data.query.pages) {
                self.placesmarker().forEach(function(item) {
                  // label = wikipagetitle
                  if (item.label == data.query.pages[k].title) {
                    var infowindow = new google.maps.InfoWindow({
                      content: data.query.pages[k].extract
                    });
                    google.maps.event.addListener(item, 'click', function() {
                      infowindow.open(map, this);
                    });
                  }
                });
              }
            }
            $("#mapInformation").append("Click on the marker to reveal some wikipedia information!");
          },
          error: function(errorMessage) {
            $("#mapInformation").append("Unfortunately wikipedia information could not be loaded, try refreshing the page!");
          }
        });
      });
    };
    ko.applyBindings(new locationsViewModel());
  } else {
    console.log('error');
    $("#map").append('Unfortunately google map could not be loaded, try reloading the page.');
  }
};

//weather api goes here
$.ajax({
  type: "GET",
  url: "http://api.openweathermap.org/data/2.5/weather?q=wiesbaden&appid=3f099c8df131401cc9914c26a1abe703",
  contentType: "application/json; charset=utf-8",
  async: true,
  dataType: "jsonp",
  success: function(wData, textStatus, jqXHR) {

    var icon = wData.weather[0].icon;
    var weatherDescription = wData.weather[0].description;
    var weatherIconUrl = 'http://openweathermap.org/img/w/';
    var fullWeatherIconUrl = weatherIconUrl + icon + '.png';
    var celsius = Math.round((wData.main.temp - 273.15));

    weatherAppendString = '<img src="' + fullWeatherIconUrl + '" alt="weather icon">';

    $("#weatherIcon").append(weatherAppendString);
    $("#temperatur").append(celsius + ' °C');
    $("#weatherDescription").append(weatherDescription);
  },
  error: function(errorMessage) {
    $("#weatherIcon").append('Unfortunately weather information <br> could not be loaded, try reloading the page.');

  }
});
