import $ from 'jquery';

//looks for wikipedia articles based on search and puts them in a passed arrray
function loadWikiData(search, array) {

var sent = false;

//sends an alert if wikipedia does not load
var wikiRequestTimeout = setTimeout(function() {
    if (send === false) {
        $('.options-box').prepend('<p> warning: could not retrieve wikipedia articles </p>');
        sent = true;
    }
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