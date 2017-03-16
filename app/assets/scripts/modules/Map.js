import locations from './Locations';
import loadWikiData from './Wikipedia';

var map;

// Create a new blank array for all the listing markers.
var markers = [];


//create map when called
var initMap = function() {

    //creates custome styles for map
    var styles = [{
        "elementType": "geometry",
        "stylers": [{
            "hue": "#ff4400"
        }, {
            "saturation": -68
        }, {
            "lightness": -4
        }, {
            "gamma": 0.72
        }]
    }, {
        "featureType": "road",
        "elementType": "labels.icon"
    }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [{
            "hue": "#0077ff"
        }, {
            "gamma": 3.1
        }]
    }, {
        "featureType": "water",
        "stylers": [{
            "hue": "#00ccff"
        }, {
            "gamma": 0.44
        }, {
            "saturation": -33
        }]
    }, {
        "featureType": "poi.park",
        "stylers": [{
            "hue": "#44ff00"
        }, {
            "saturation": -23
        }]
    }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
            "hue": "#007fff"
        }, {
            "gamma": 0.77
        }, {
            "saturation": 65
        }, {
            "lightness": 99
        }]
    }, {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "gamma": 0.11
        }, {
            "weight": 5.6
        }, {
            "saturation": 99
        }, {
            "hue": "#0091ff"
        }, {
            "lightness": -86
        }]
    }, {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
            "lightness": -48
        }, {
            "hue": "#ff5e00"
        }, {
            "gamma": 1.2
        }, {
            "saturation": -23
        }]
    }, {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "saturation": -64
        }, {
            "hue": "#ff9100"
        }, {
            "lightness": 16
        }, {
            "gamma": 0.47
        }, {
            "weight": 2.7
        }]
    }];
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 45.5294134,
            lng: -73.6087074
        },
        zoom: 13,
        styles: styles,
        mayTypeControl: false
    });

    // Styles defualt marker
    var defaultIcon = makeMarkerIcon('bf2f03');
    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('ed1509');

    //creat window that will be used to populate window content
    var largeInfowindow = new google.maps.InfoWindow();
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        //Get title from the locatons array
        var title = locations[i].title;

        //will fill with wikipedia articles
        var wikiArticles = [];

        //searches for wikipedia articles based on marker title
        loadWikiData(title, wikiArticles);
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i,
            wikiArticles: wikiArticles
        });

        // Push the marker to our array of markers.
        markers.push(marker);



        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            toggleBounce(this);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        //will populate info windwo and bounce marker when list item is clicked on
        marker.activateFromList = function() {
            toggleBounce(this);

            populateInfoWindow(this, largeInfowindow);

            //console.log(map.getBounds().contains(marker.getPosition()));


        };
    }
    //shows listings
    document.getElementById('show-listings').addEventListener('click', showListings);
    //hide listings
    document.getElementById('hide-listings').addEventListener('click', hideListings);
};

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent('');
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
        var streetViewService = new google.maps.StreetViewService();
        var radius = 50;
        // In case the status is OK, which means the pano was found, compute the
        // position of the streetview image, then calculate the heading, then get a
        // panorama from that and set the options

        //an empty array that will become populated with
        //wikipedia articles based on location.

        function getStreetView(data, status) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(
                    nearStreetViewLocation, marker.position);


                var infoWindowTitle = marker.title;

                //checks if the wikiArticle array is empty
                //if not, sets infoWindow to hyperlink to Wikipedia Article
                function checkForArticles() {
                    if (marker.wikiArticles.length > 0) {
                        infoWindowTitle = '<a href="' + marker.wikiArticles[0] + '">' + marker.title + '</a>';
                    }
                }

                checkForArticles();

                //populates rest of info window
                infowindow.setContent('<div>' + infoWindowTitle + '</div><div id="pano"></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };

                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent('<div>' + marker.title + marker.wikiArticles[0] + '</div>' +
                    '<div>No Street View Found</div>');
            }
        }
        // Use streetview service to get the closest streetview image within
        // 50 meters of the markers position
        streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}
//Create bounce animation
function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        //makes animation stop after 3 bounces
        setTimeout(function() {
            marker.setAnimation(null);
        }, 2100);
    }
}

//This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}
// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}

//webpack sets initMap to a local variable by default
//this sets initMap to global
window.initMap = initMap;

export default {
    markers: markers,
    initMap: initMap,
    toggleBounce: toggleBounce,
    populateInfoWindow: populateInfoWindow


};