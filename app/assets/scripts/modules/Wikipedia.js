import $ from 'jquery';

//looks for wikipedia articles based on search and puts them in a passed arrray
function loadWikiData(search, array) {


//NEED TO FIND PLACE FOR TIME OUT REQUEST
var wikiRequestTimeout = setTimeout(function() {
    //$wikiElem.text("failed to get wikpedia resources");
}, 8000);

var wikiLink = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='+search+'&format=json';

//calls dataa
$.ajax(wikiLink, {
    dataType: 'jsonp',
}).done(function (data) {
    for(var i=0; i< data.length; i++) {
        var wikiHeader = data[1][i];
        var wikiArticleURL = data [3][i];
        var formattedLink = '<a href="' +wikiArticleURL+ '">' + wikiHeader+ '</a>'

        if(wikiArticleURL != undefined) {
            array.push(wikiArticleURL);
        }

    };

    clearTimeout(wikiRequestTimeout);
});

};


export default loadWikiData;