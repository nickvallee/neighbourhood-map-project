import ko from 'knockout';
import locations from './Locations';
import loadWikiData from './Wikipedia';
import map from './Map';
import toggleBounce from './Map';

var markers = map.markers;


var Location = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.wikiArticle = ko.observableArray([]);
    this.order = ko.observable();

    this.visible = ko.observable(true);


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

    //count increments as order is recorded into the obserable array

    });

    self.count = 0;

    self.locationList().forEach(function(locationItem) {
        locationItem.order(self.count);
        self.count += 1;

    });

    self.showInfo = function(locationItem) {
             //toggleBounce(markers[locationItem.order]);
            console.log(markers[locationItem.order()]);
            var currentMarker = markers[locationItem.order()];
            var currentID = currentMarker.id;
            //toggleBounce(markers[currentMarker.id]);
            toggleBounce(currentMarker.id);
    };

}


var vm = new AppViewModel();



AppViewModel.prototype.filteredItems = ko.computed( function() {
    var self = this;

    var filter = self.searchTerm().toLowerCase();

    if (!filter) {


        self.locationList().forEach(function(locationItem){

            locationItem.visible(true);

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

