import ko from 'knockout';
import locations from './Locations';
import loadWikiData from './Wikipedia';
import map from './Map';

//renames marker array to make it easier to use in AppViewModel
var markers = map.markers;


//location constructor for items in locationList();
var Location = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.wikiArticle = ko.observableArray([]);
    this.order = ko.observable();

    this.visible = ko.observable(true);


};

//communicate with list and present information on the page
var AppViewModel = function() {
    var self = this;

    //filters list items and marker based on value
    this.searchTerm = ko.observable("");

    //create observable array that populates LocationList
    this.locationList = ko.observableArray([]);

    //gets data for Locations and stores it in observable array
    locations.forEach(function(locationItem) {
        self.locationList.push(new Location(locationItem));
    });

    //iterates through list and adds wikipedia link, if applicable
    self.locationList().forEach(function(locationItem) {
        var title = locationItem.title();
        var article = locationItem.wikiArticle();

        loadWikiData(title, article);

        //count increments as order is recorded into the obserable array

    });

    //increments as .order value is update in locationItem
    self.count = 0;

    //sets order variable to value based on the index of locationItem
    self.locationList().forEach(function(locationItem) {
        locationItem.order(self.count);
        self.count += 1;

    });

    //click on list item, corresponding marker will bounce, and info window will open
    self.showInfo = function(locationItem) {
        var currentMarker = markers[locationItem.order()];


        currentMarker.activateFromList();

    };
};

//create instance of AppViewModel
var vm = new AppViewModel();


//filters list items and markers based on what's writen in search box
AppViewModel.prototype.filteredItems = ko.computed(function() {
    var self = this;

    var filter = self.searchTerm().toLowerCase();

    //if there search box is empty, show all markers
    //otherwise show content if it contains value in search box
    if (!filter) {
        self.locationList().forEach(function(locationItem) {
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

                if (currentMarker.includes(filter)) {
                    markers[i].setVisible(true);
                } else {
                    markers[i].setVisible(false);
                }
            }


            return result;
        });
    }

}, vm);

//apply bindings to DOM
ko.applyBindings(vm);