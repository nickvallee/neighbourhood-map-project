import ko from 'knockout';
import loadWikiData from '../modules/Wikipedia';

import locations from './Locations';
import map from './Map';

var markers = map.markers;

var Location = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.wikiArticle = ko.observableArray([]);

    this.visible = ko.observable(true);

}

var Marker = function(data) {
    this.title = ko.observable(data.title);
    this.visible = ko.observable(data.visible);
    this.id = ko.observable(data.id);
}

var AppViewModel = function() {
    var self = this;

    this.searchTerm = ko.observable("");

    this.locationList = ko.observableArray([]);

    locations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));

    });

    self.locationList().forEach(function(locationItem) {
        var title = locationItem.title();
        var article = locationItem.wikiArticle();

        loadWikiData(title, article);

    });


    this.currentLocation = ko.observable(this.locationList()[0]);



}


var vm = new AppViewModel();



AppViewModel.prototype.filteredItems = ko.computed( function() {
    var self = this;

    var filter = self.searchTerm().toLowerCase();

    if (!filter) {


        self.locationList().forEach(function(locationItem){

            locationItem.visible(true);

            console.log('BLAH');

        });

        for (var i = 0; i < self.locationList().length; i++) {
        if (markers.length > 0) {
            markers[i].setVisible(true);

            }
        }

      return self.locationList();
    } else {

      return ko.utils.arrayFilter(self.locationList(), function(locationItem) {

        var string = locationItem.title().toLowerCase();
        var result = (string.search(filter) >= 0);
        locationItem.visible(result);



      for (var i = 0; i < self.locationList().length; i++) {
            var currentMarker = markers[i].title.toLowerCase();

            if(currentMarker.includes(filter)) {
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        };


        return result;
      });
    }

  }, vm);


ko.applyBindings(vm);
