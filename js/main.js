// // Add all scripts to the JS folder
// var minValue;
// var map = L.map('mapid').setView([25, 25], 5);
//     //add OSM base tilelayer
// L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
// 	maxZoom: 20,
// 	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
// }).addTo(map);
// var minValue;

//     //call getData function
// getData();
// // };

// var popup = L.popup()
//     .setLatLng([30, 25])
//     .setContent("Military spending (in millions of USD) by year across Northern Africa and the Middle East. Points represent country capital cities.")
//     .openOn(map);

// //added at Example 2.3 line 20...function to attach popups to each mapped feature
// function onEachFeature(feature, layer) {
//     //no property named popupContent; instead, create html string with all properties
//     var popupContent = "";
//     if (feature.properties) {
//         //loop to add feature property names and values to html string
//         for (var property in feature.properties){
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         layer.bindPopup(popupContent);
//     };
// };

// // //function to retrieve the data and place it on the map
// // function getData(){
// //     //load the data
// //     fetch("data/militaryspending.geojson")
// //         .then(function(response){
// //             return response.json();
// //         })
// //         .then(function(json){            
// //             //create marker options
// //             var geojsonMarkerOptions = {
// //                 radius: 8,
// //                 fillColor: "#ff7800",
// //                 color: "#000",
// //                 weight: 1,
// //                 opacity: 1,
// //                 fillOpacity: 0.8
// //             };
// //             //create a Leaflet GeoJSON layer and add it to the map
// //             L.geoJson(json, {
// //                 onEachFeature: onEachFeature,
// //                 pointToLayer: function (feature, latlng){
// //                     return L.circleMarker(latlng, geojsonMarkerOptions);
// //                 }
// //             }).addTo(map);
// //         });              
// // };

// //Step 3: Add circle markers for point features to the map
// function createPropSymbols(data){
//     //Step 4. Determine the attribute for scaling the proportional symbols
//     var attribute = 2020;
//     //create marker options
//     var geojsonMarkerOptions = {
//         radius: 8,
//         fillColor: "#ff7800",
//         color: "#000",
//         weight: 1,
//         opacity: 1,
//         fillOpacity: 0.8
//     };

//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(data, {
//         pointToLayer: function (feature, latlng) {
//             //Step 5: For each feature, determine its value for the selected attribute
//             var attValue = Number(feature.properties[attribute]);
//             // console.log('attValue:'+feature.properties["Country"])
//             console.log('attValue for '+feature.properties["Country"]+": "+attValue)
//             //examine the attribute value to check that it is correct
//             console.log(feature.properties, attValue);
//              //Step 6: Give each feature's circle marker a radius based on its attribute value
//             geojsonMarkerOptions.radius = calcPropRadius(attValue);
//             //create circle markers
//             return L.circleMarker(latlng, geojsonMarkerOptions);
//         }
//     }).addTo(map);
// };

// //Step 2: Import GeoJSON data
// function getData(){
//     //load the data
//     fetch("data/militaryspending.geojson")
//         .then(function(response){
//             return response.json();
//         })
//         .then(function(json){
//             calculateMinValue(json);
//             console.log('minValue in createPropSymbols: '+minValue);
//             createPropSymbols(json);
//             console.log('Ran createPropSymbols')
//         })
// };

// function calculateMinValue(data){
//     //create empty array to store all data values
//     var allValues = [];
//     //loop through each city
//     for(var city of data.features){
//         //loop through each year
//         for(var year = 1985; year <= 2015; year+=5){
//               //get population for current year
//               var value = city.properties["Pop_"+ String(year)];
//               //add value to array
//               allValues.push(value);
//         }
//     }
//     //get minimum value of our array
//     var minValue = Math.min(...allValues)
//     console.log('Made it to the end of calculateMinValue...value of minValue = '+minValue)
//     return minValue;
// }


// //calculate the radius of each proportional symbol
// function calcPropRadius(attValue) {
//     //constant factor adjusts symbol sizes evenly
//     var minRadius = 5;
//     //Flannery Apperance Compensation formula
//     var middleVal = attValue/minValue
//     var radius = 1.0083 * Math.pow(middleVal,0.5715)*minRadius
//     console.log('radius: '+radius)
//     console.log('attValue: '+attValue)
//     console.log('minRadius: '+minRadius)
//     console.log('minValue: '+minValue)
//     console.log('middleVal: '+middleVal)
//     return radius;
// };

// // document.addEventListener('DOMContentLoaded',createMap)


//______alt code________________________________________-
//declare map variable globally so all functions have access
var map;
var minValue;

//step 1 create map
function createMap(){

    //create the map
    map = L.map('mapid', {
        center: [25, 25],
        zoom: 4
    });

    //add OSM base tilelayer
    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    //call getData function
    getData(map);
};

function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each country
    for(var country of data.features){
        //loop through each year
        // console.log(country.properties['Country']+': ')
        for(var year = 2010; year <= 2020; year+=1){
              //get population for current year
              var value = country.properties[year];
            //   console.log(year+': '+value)
              //add value to array
              if (value != 0) {
                allValues.push(value);
              }
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)
    // console.log('minValue = '+minValue)
    // if (minValue == 0) {
    //     minValue = 1000
    // } 
    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    // console.log('minRadius = '+minRadius)
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius
    // console.log('attValue = '+attValue)
    // console.log('minValue = '+minValue)
    // console.log('radius = '+radius)
    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    // console.log('started pointToLayer')
    //Determine which attribute to visualize with proportional symbols
    var attribute = "2020";

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    // console.log('set attValues: '+attValue)
    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    // var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p><p><b>" + attribute + ":</b> " + feature.properties[attribute] + "</p>";
    //build popup content string starting with city...Example 2.1 line 24
    var popupContent = "<p><b>City:</b> " + feature.properties.Country + "</p>";
    // console.log(popupContent)
    //add formatted attribute to popup content string
    // var year = attribute.split("_")[1];

    // popupContent += "<p><b><Military spending> in " + attribute + ":</b> " + feature.properties[attribute] + " millions of USD</p>";
    console.log(popupContent)
    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius) 
    });
    console.log('bound the popup to the circle maker')
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Step 1: Create new sequence controls
function createSequenceControls(){
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);
    //set slider attributes
    document.querySelector(".range-slider").max = 10;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;
    //below Example 3.6...add step buttons
    // document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse">Reverse</button>');
    // document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward">Forward</button>');
    console.log('created sequence control');
};

// //Step 3: Add circle markers for point features to the map
function createPropSymbols(data){

    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "2020";

    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 8
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);

            //Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};
// //Add circle markers for point features to the map
// function createPropSymbols(data, map){
//     //create a Leaflet GeoJSON layer and add it to the map
//     L.geoJson(data, {
//         pointToLayer: pointToLayer
//     }).addTo(map);
// };

//Step 2: Import GeoJSON data
function getData(){
    //load the data
    // fetch("data/MegaCities.geojson")
    fetch("data/militaryspending.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
            createSequenceControls();
            console.log('ran creatPropSymbols')
        })
};

document.addEventListener('DOMContentLoaded',createMap)
