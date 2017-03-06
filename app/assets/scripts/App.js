var mapLoaded = false;

import $ from 'jquery';
import ko from 'knockout';
import { map, markers, initMap, callGoogleMaps} from'./modules/Map';
//import { js_file, callGoogleMaps } from './modules/GoogleMapsCall';
//import'./modules/Test';
//import'./modules/AppViewModel';



callGoogleMaps();

function loadScript( url, callback ) {
  var script = document.createElement( "script" )
  script.type = "text/javascript";
  if(script.readyState) {  //IE
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function() {
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName( "head" )[0].appendChild( script );
}


/*
$(function() {

    app.initMap = function() {
      map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 40.7413549, lng: -73.998024},
            zoom: 13
       });

    };


    app.test = function() {
        console.log( "test successful" );
    };

    app.test();

    //app.initMap();

});
*/


