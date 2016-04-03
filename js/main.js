var koViewModel;

//json with places in wiesbaden wich will show up on the map
var places = [{
  name: "Hessisches Staatstheater Wiesbaden",
  lating: {
    lat: 50.0837223,
    lng: 8.2437581
  },
  description: "Hessisches Staatstheater Wiesbaden",
  wikipagetitle: "Hessisches Staatstheater Wiesbaden"
}, {
  name: "Wilhelmstraße",
  lating: {
    lat: 50.082338,
    lng: 8.2425596
  },
  description: "Wilhelmstraße",
  wikipagetitle: "Wilhelmstraße (Wiesbaden)"
}, {
  name: "Biebrich Palace",
  lating: {
    lat: 50.0373451,
    lng: 8.2319409
  },
  description: "Biebrich Palace",
  wikipagetitle: "Biebrich Palace"
}, {
  name: "Nerobergbahn",
  lating: {
    lat: 50.0946675,
    lng: 8.2210174
  },
  description: "Nerobergbahn",
  wikipagetitle: "Nerobergbahn"
}, {
  name: "Wiesbaden Hauptbahnhof",
  lating: {
    lat: 50.0709347,
    lng: 8.2412096
  },
  description: "Wiesbaden Main Station",
  wikipagetitle: "Wiesbaden Hauptbahnhof"
}, {
  name: "St Elizabeth's Church",
  lating: {
    lat: 50.0976096,
    lng: 8.2325569
  },
  description: "St Elizabeth's Church",
  wikipagetitle: "St Elizabeth's Church, Wiesbaden"
}, {
  name: "Kochbrunnen",
  lating: {
    lat: 50.0863564,
    lng: 8.239679
  },
  description: "Kochbrunnen",
  wikipagetitle: "Kochbrunnen"
}, {
  name: "Opelbad",
  lating: {
    lat: 50.0976812,
    lng: 8.2299419
  },
  description: "Opelbad",
  wikipagetitle: "Opelbad"
}];


// knockout.js viewmodel
function locationsViewModel() {

  var markerImage = {
    url: 'img/Wappen_Wiesbaden.svg',
    // This marker is 20 pixels wide by 32 pixels high.
    scaledSize: new google.maps.Size(28, 30),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32)
  };

  var self = this;
  self.Locations = ko.observableArray(places);
  self.filter = ko.observable('');
  self.placesmarker = ko.observableArray([]);
  self.weatherIcon = ko.observable();
  self.temperatur = ko.observable();
  self.weatherDescription = ko.observable();
  self.mapInformation = ko.observable();
  self.map = ko.observable();

  // creating maps markers and pupulating placesmarker
  places.forEach(function(item) {
    self.placesmarker.push(new google.maps.Marker({
      position: item.lating,
      map: map,
      title: item.name,
      label: {
        text: item.wikipagetitle,
        color: 'yellow'
      },
      icon: markerImage
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
          item.infowindow.close();
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
        mItem.infowindow.open(map, mItem);
        setTimeout(function() {
          mItem.setAnimation(null);
        }, 700);
      } else {
        mItem.infowindow.close();
      }
    });
  };
}
//in case google maps api fails this function executes
var googleError = function() {
  koViewModel.mapInformation('Unfortunately google map could not be loaded, try reloading the page.');
};
//callbck function invoked by google maps api call
var callbackGM = function() {
  var map;
  if (typeof google === 'undefined') {
    nm('error');
  } else {
    initMap();
    nm('ok');
  }
};
//initialize google map
var initMap = function() {
  var myLatLng = {
    lat: 50.0653546,
    lng: 8.2341895
  };
  //create new google map object
  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    scrollwheel: false,
    zoom: 13
  });
};
//function for populating map and invoking ko view model
var nm = function(state) {
  var wikiTitelsForUrl = '';
  //if google map loaded properly start populating map with markers, markers info window with wikipedia content etc.
  if (state === 'ok') {

    //wikimedia api titles string concatenation
    places.forEach(function(item, index) {
      if (places.length - index - 1 === 0) {
        wikiTitelsForUrl = wikiTitelsForUrl + item.wikipagetitle;
      } else {
        wikiTitelsForUrl = wikiTitelsForUrl + item.wikipagetitle + '|';
      }
    });

    // jquery ajax call for wikipedia
    $(document).ready(function() {
      $.ajaxPrefilter("json script", function(options) {
        options.crossDomain = true;
      });
      $.ajaxSetup({
        dataType: "json"
      });
      var wikiMediaReq = $.ajax({
        type: "GET",
        url: "https://en.wikipedia.org/w/api.php?format=json&action=query&titles=" + wikiTitelsForUrl + "&prop=extracts&exlimit=max&explaintext&exintro",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "jsonp"
      });
      wikiMediaReq.done(function(data, textStatus, jqXHR) {
        // in case api calll was sucsessfull populate marker info window with wikipedia information
        if (data.query.pages != 'undefined') {
          for (var k in data.query.pages) {
            koViewModel.placesmarker().forEach(function(item) {
              // label = wikipagetitle
              if (item.label.text == data.query.pages[k].title) {
                item.infowindow = new google.maps.InfoWindow({
                  content: data.query.pages[k].extract
                });
                // add click event to each marker
                google.maps.event.addListener(item, 'click', function() {
                  item.infowindow.open(map, item);
                  item.setAnimation(google.maps.Animation.BOUNCE);
                  setTimeout(function() {
                    item.setAnimation(null);
                  }, 700);
                  // when one info window opens close all other info windows
                  koViewModel.placesmarker().forEach(function(pItem) {
                    if (item.label.text !== pItem.label.text) {
                      pItem.infowindow.close();
                    }
                  });
                });
              }
            });
          }
        }
        // add tip how to see wikipedia information
        koViewModel.mapInformation("Click on the marker to reveal some wikipedia information!");
      });
      //in case wikimedia api failed this gets executed
      wikiMediaReq.fail(function() {
        koViewModel.mapInformation("Unfortunately wikipedia information could not be loaded, try refreshing the page!");
      });

    });
    //knockout view model intitialization
    koViewModel = (new locationsViewModel());
    ko.applyBindings(koViewModel);
  } else {
    //if google map did not load properly, tell vivistor to reload.
    koViewModel = (new locationsViewModel());
    ko.applyBindings(koViewModel);
    koViewModel.map('Unfortunately google map could not be loaded, try reloading the page.');
  }
};

//open weather api data will be loaded here
var openWeatherReq = $.ajax({
  type: "GET",
  url: "http://api.openweathermap.org/data/2.5/weather?q=wiesbaden&appid=3f099c8df131401cc9914c26a1abe703",
  contentType: "application/json; charset=utf-8",
  async: true,
  dataType: "jsonp",
  error: function(errorMessage) {}
});
// executes in case of sucsessfull open weather api request
openWeatherReq.done(function(wData) {
  var icon = wData.weather[0].icon;
  var weatherDescription = wData.weather[0].description;
  var weatherIconUrl = 'http://openweathermap.org/img/w/';
  var fullWeatherIconUrl = weatherIconUrl + icon + '.png';
  var celsius = Math.round((wData.main.temp - 273.15));
  var weatherAppendString = '<img src="' + fullWeatherIconUrl + '" alt="weather icon">';

  koViewModel.weatherIcon(weatherAppendString);
  koViewModel.temperatur(celsius + ' °C');
  koViewModel.weatherDescription(weatherDescription);

});
// executes in case of unsucsessfull open weather api request
openWeatherReq.fail(function() {
  koViewModel.weatherIcon('<div>Unfortunately weather information <br> could not be loaded, try reloading the page.</div>');
});
