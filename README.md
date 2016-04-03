#Udacity Neighborhood Map: Project 5#

Follow the link to open the [project](http://peng-ling.github.io/neighborhood_map/)

This project is using [Google Maps api](https://developers.google.com/maps/documentation/javascript/?hl=en) to display
Wiesbaden City, Germany.
The markers displaying monuments and main attractions of Wiesbaden.

[Wikimedia api](https://www.mediawiki.org/wiki/API:Main_page)
is used to equip the markers with some information about this places,
which one can reveal by clicking on them.

[Openweathermap api](http://openweathermap.org/current) is used to show the actual weather in Wiesbaden in the navigation bar.

At the left panel one can search / filter places the Places list and the marker will be
automatically updated. This is done by [knockout.js](http://knockoutjs.com/).

The page has a responsive design which is build using [bootstrap css framework](http://getbootstrap.com/).

The asynchronous api calls for openwethermap und wikimedia are done by [jquer.js](https://jquery.com/)
