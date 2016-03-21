var map;
var wiki;
var weather;
var weatherAppendString;

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

  this.state = state;

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
    name: "Wilhelmstraße (Wiesbaden)",
    lating: {
      lat: 50.082338,
      lng: 8.2425596
    },
    description: "Wilhelmstraße (Wiesbaden)",
    /*icon: '',*/
    visible: true,
    wikipagetitle: "Wilhelmstraße_(Wiesbaden)"
  }, {
    name: "Biebrich Palace",
    lating: {
      lat: 50.0373451,
      lng: 8.2319409
    },
    description: "Biebrich Palace",
    /*icon: '',*/
    visible: true,
    wikipagetitle: "Biebrich_Palace"
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
    //console.log('PM: ' + self.placesmarker());

    self.filteredplacesmarker = ko.computed(function() {
      var filter = self.filter().toLowerCase();
      if (!filter || filter === '') {
        self.placesmarker().forEach(function(item) {
          item.setVisible(true);
        });
      } else {
        self.placesmarker().forEach(function(item) {
          if (RegExp(filter).test(item.title.toLowerCase())) {
            console.log('true filter:' + filter + ' item: ' + item.title);
            item.setVisible(true);
            //console.log(item);
          } else {
            console.log('false filter:' + filter + ' item: ' + item.title);
            item.setVisible(false);
          }
        });
      }
      //console.log('------------------');
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

    //click on places list item invokes this function
    self.setPlace = function(pItem) {
      console.log(pItem);
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
        //action=query&prop=extracts
        url: "https://en.wikipedia.org/w/api.php?format=json&action=query&titles=Biebrich_Palace|Nerobergbahn|Hessisches_Staatstheater_Wiesbaden|Wilhelmstraße_(Wiesbaden)&prop=extracts&exlimit=max&explaintext&exintro",
        //url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=Jimi_Hendrix|Eddie_Van_Halen",
        //url: "https://crossorigin.me/https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Jimi_Hendrix",
        contentType: "application/json; charset=utf-8",
        async: true,
        dataType: "jsonp",
        success: function(data, textStatus, jqXHR) {
          wiki = data;
          //console.log(data);
          if (data.query.pages != 'undefined') {
            for (var k in data.query.pages) {
              self.placesmarker().forEach(function(item) {
                //console.log('Marker: ' + item.title + ' wiki: ' + data.query.pages[k].title);
                if (item.title == data.query.pages[k].title) {
                  var infowindow = new google.maps.InfoWindow({
                    content: data.query.pages[k].extract
                  });
                  //console.log('INFO:' + infowindow);
                  //console.log('Search hit Marker: ' + item.title + ' wiki: ' + data.query.pages[k].extract);
                  google.maps.event.addListener(item, 'click', function() {
                    //infoWindow.setContent(data.query.pages[k].extract)
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

  //weather api goes here
  $.ajax({
    type: "GET",
    url: "http://api.openweathermap.org/data/2.5/weather?q=wiesbaden&appid=3f099c8df131401cc9914c26a1abe703",
    contentType: "application/json; charset=utf-8",
    async: true,
    dataType: "jsonp",
    success: function(wData, textStatus, jqXHR) {

      weather = wData;

      var icon = wData.weather[0].icon;

      var weatherIconUrl = 'http://openweathermap.org/img/w/';

      var fullWeatherIconUrl = weatherIconUrl + icon + '.png';

      weatherAppendString = '<img src="' + fullWeatherIconUrl + '" alt="weather icon">';

      $("#weatherIcon").append(weatherAppendString);


    },
    error: function(errorMessage) {
      console.log(errorMessage);
    }
  });

  ko.applyBindings(new locationsViewModel());

};
