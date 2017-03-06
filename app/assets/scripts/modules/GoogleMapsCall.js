var js_file = document.createElement('script');
js_file.type = 'text/javascript';
js_file.callback = initMap();
js_file.src = 'https://maps.googleapis.com/maps/api/js?libraries=geometry&key=AIzaSyA56O00SWz5jCIbOA4AHsa9Ei5_ObpQlV8&v=3&callback='+ js_file.callback;


function callGoogleMaps() {
    document.getElementsByTagName('head')[0].appendChild(js_file);
}