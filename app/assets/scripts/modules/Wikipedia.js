import $ from 'jquery';

function loadWikiData(search, array) {
///WIKIPEDIA API


var wikiRequestTimeout = setTimeout(function() {
    //$wikiElem.text("failed to get wikpedia resources");
}, 8000);

var wikiLink='http://en.wikipedia.org/w/api.php?action=opensearch&search='+search+'&format=json';
//console.log("wikiLink: "+wikiLink);

$.ajax(wikiLink, {
    dataType: 'jsonp',
}).done(function (data) {
    //console.log(data);

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