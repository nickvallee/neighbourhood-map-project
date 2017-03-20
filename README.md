## Nick's Neighbourhood Map

    This is the Udacity Neighbourhood Map project. I use the **Google Maps API**, the**Wikipedia API** and **KnockoutJS** to build an app that displays popular locations in my neighbourhood, and displays relevant Wikipedia articles about the location, if they exist.

## Features
When you press **show listings** the map will populate with 10 markers on the map. You can filter through the locations with the search bar. As you type, the list of locations and the markers will update. Click **hide listings** to hide all listings.
if you click on a marker or a list item, the marker will bounce and an info window will pop up, showing the location's title and street view.  If there is a Wikipedia article associated with the location, the title will be hyperlinked to the article.

## See project on Github Pages
https://nickvallee.github.io/neighbourhood-map-project/

## How to Run Project Locally

    1.clone or fork repo locally
    2.navigate to local folder in command-line
    3.run the command **npm install** to install all dependencies
    4.Once install is complete, run the command **gulp watch**
    5.project should run automatically in the browser, and update when files are edited
    6.If this does not work, open **index.html** directly

## What I used to build this project
* Google Maps API
* Wikipedia API
* KnockoutJS
* Gulp
* webpack
* babel
* postcss
* jquery
* normalize.css