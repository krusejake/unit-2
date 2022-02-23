// var map = L.map('mapid').setView([-110, 60], 13);

console.log('started file')

// L.map() = "[t]he central class of the API — it is used to create a map on a page and manipulate it
var map = L.map('mapid',{ 
    center:[45.505, -90],
    zoom:5 //13
});

console.log('set map center')
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};
// adds geojson feature to the map
L.geoJSON(geojsonFeature).addTo(map);
console.log('should have added feature to map')

var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};
// specify one style and apply to all lines that are added to the map
L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);

// alternative process: use empty geojson to create map, then add features to layer
var myLayer = L.geoJSON().addTo(map);
myLayer.addData(geojsonFeature);

var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]]
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]]
    }
}];
//created list of features and then set color depending on the party value in properties
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"};
            case 'Democrat':   return {color: "#0000ff"};
        }
    }
}).addTo(map);

console.log('added states')
var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
// need to pass in marker instead of just a point

// geojsonFeature defined below - stadium location
L.geoJSON(geojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

// map.panTo([-200, 50]);
// executes functions specified for all geo features in layer
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
};

L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);

var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.98404, 39.74621]
    }
}];
//show features on map if show_on_map property = True
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);

// var popup = L.popup()
//     .setLatLng([-105, 50])
//     .setContent("I am a standalone popup at [-105, 50]")
//     .openOn(map);

    // function onMapClick(e) {
    //     alert("You clicked the map at (LongLat)");// + e.latlng);
    // }
    
    // map.on('click', onMapClick);    

// Added popup to retrieve info from map for orientation
var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at (entered as Long/Lat)..." + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);

console.log('end of file')