//declare map variable globally so all functions have access
var map;
var minValue;

//Example 1.2 line 1...PopupContent constructor function
function PopupContent(properties, attribute){
    this.properties = properties;
    this.year = attribute
    this.spending = this.properties[attribute];
    this.formatted = "<p><b>County:</b> " + this.properties['Country'] + "</p><p><b>Miltiary spending in " + this.year + ":</b> " + this.spending + " million</p>";
};

//step 1 create map
function createMap(){
    //create the map
    map = L.map('mapid', {
        center: [25, 25],
        zoom: 4
    });

    //add base tilelayer
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
        for(var year = 2010; year <= 2020; year+=1){
              //get spending for current year
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
    return minValue;
}

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius
    return radius;
};

//function to convert markers to circle markers
function pointToLayer(feature,latlng,attributes){
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];
    console.log('attributes in pointToLayer: '+attributes)
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
    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);
    //create circle marker layer
    var layer = L.circleMarker(latlng, options);
    var popup = new PopupContent(feature.properties, attribute)
    //bind the popup to the circle marker
    layer.bindPopup(popup.formatted, {
        offset: new L.Point(0,-options.radius) 
    });
    return layer;
};

//Step 1: Create new sequence controls
function createSequenceControls(attributes){
    console.log('entered createSequenceControls')
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);
    //set slider attributes
    document.querySelector(".range-slider").max = 10;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;
    //below Example 3.6...add step buttons
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse">Reverse</button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward">Forward</button>');
    //replace button content with images
    document.querySelector('#reverse').insertAdjacentHTML('beforeend',"<img src='img/reverse.png'>");
    document.querySelector('#forward').insertAdjacentHTML('beforeend',"<img src='img/forward.png'>");
    //Below Example 3.6 in createSequenceControls()
    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            //sequence
        })
    })

    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){
        //Step 6: get the new index value
        var index = this.value;
        console.log(index)
    });
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            var index = document.querySelector('.range-slider').value;
            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 10 ? 0 : index;
                //Called in both step button and slider event listener handlers
                //Step 9: pass new attribute to update symbols
                updatePropSymbols(attributes[index]);
            } else if (step.id == 'reverse'){
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 10 : index;
                //Called in both step button and slider event listener handlers
                //Step 9: pass new attribute to update symbols
                updatePropSymbols(attributes[index]);
            };
            //Step 8: update slider
            document.querySelector('.range-slider').value = index;
        })
    })
};
//Step 10: Resize proportional symbols according to new attribute values
function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        // console.log('will updatePopSymbols...')
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;
            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            // console.log('props: '+props['Country'])
            var popupContent = new PopupContent(props, attribute)
            //update popup content            
            popup = layer.getPopup();            
            popup.setContent(popupContent.formatted).update();
        };
        
    });
};

function createPropSymbols(data, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
};

//Above Example 3.10...Step 3: build an attributes array from the data
function processData(data){
    //empty array to hold attributes
    var attributes = [];
    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if ((attribute !='Latitude')&(attribute !='Longitude')&(attribute !='Country')) {
            attributes.push(attribute);
        };
    };
    return attributes;
};

//Step 2: Import GeoJSON data
function getData(){
    //load the data
    fetch("data/militaryspending.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var attributes = processData(json);
            minValue = calculateMinValue(json);
            createPropSymbols(json, attributes);
            createSequenceControls(attributes);
        })
};

document.addEventListener('DOMContentLoaded',createMap)
