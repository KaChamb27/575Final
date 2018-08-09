/* Sequence crop years */

var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        
        onAdd: function(map) {
            //create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');
            
            //move slider into onAdd
            $(container).append('<input class="range-slider" type="range">');
            
            //add skip buttons
            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
            //replace button content with images
            $('#reverse').html('<img src="img/reversearrow.png">');
            $('#forward').html('<img src="img/forwardarrow.png">');
            
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            
            //... initialize other dom elements, i.e. listeners.
            
            return container;
        }
    });
    
    map.addControl(new SequenceControl());
    
    //create range input element (slider)
    //$('#panel').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    $('.range-slider').attr({
        max: 9,
        min: 0,
        value: 0,
        step: 1
    });
    
    
    
    //click listerner for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();
        //increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //if past the last attribute, wrap around to first attribute
            index = index > 9 ? 0 : index;
            //pass new attribute to update symbols
            updatePropSymbols(map, attributes[index]);
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //if past the first attribute, wrap around to last attribute
            index = index < 0 ? 9 : index;
            //pass new attribute to update symbols
            updatePropSymbols(map, attributes[index]);
        $('.range-slider').val(index);
        
        };
    });
//Create sequence controls
function createSequenceControls(map, attributes){
    
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },
        
        onAdd: function(map) {
            //create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');
            
            //move slider into onAdd
            $(container).append('<input class="range-slider" type="range">');
            
            //add skip buttons
            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
            //replace button content with images
            $('#reverse').html('<img src="img/reversearrow.png">');
            $('#forward').html('<img src="img/forwardarrow.png">');
            
            //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            
            //... initialize other dom elements, i.e. listeners.
            
            return container;
        }
    });
    
    map.addControl(new SequenceControl());
    
    //create range input element (slider)
    //$('#panel').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    $('.range-slider').attr({
        max: 9,
        min: 0,
        value: 0,
        step: 1
    });
    
    
    
    //click listerner for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();
        //increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //if past the last attribute, wrap around to first attribute
            index = index > 9 ? 0 : index;
            //pass new attribute to update symbols
            updatePropSymbols(map, attributes[index]);
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //if past the first attribute, wrap around to last attribute
            index = index < 0 ? 9 : index;
            //pass new attribute to update symbols
            updatePropSymbols(map, attributes[index]);
        $('.range-slider').val(index);
        
        };
    });
};

//createSequenceControls(map, data);




/*
//Menu function
function filterRank(mydata){
    //var geoObject = mydata.features;
    var markers =[];
    markers = mydata.features;
    
    $('.menu-ui a').on('click', function() {
        // For each filter link, get the 'data-filter' attribute value.
        var filter = $(this).data('filter');
        $(this).addClass('active').siblings().removeClass('active');
        
        markers.setFilter(function(f) {
        // If the data-filter attribute is set to "all", return
        // all (true). Otherwise, filter on markers that have
        // a value set to true based on the filter name.
            return (filter === 'all') ? true : f.properties[filter] === true;
    });
    return false;
    });
} */


/*

$('.menu-ui a').on('click', function() {
    // For each filter link, get the 'data-filter' attribute value.
    var filter = $(this).data('filter');
    $(this).addClass('active').siblings().removeClass('active');
    createPropSymbols.setFilter(function(f) {
        // If the data-filter attribute is set to "all", return
        // all (true). Otherwise, filter on markers that have
        // a value set to true based on the filter name.
        return (filter === 'all') ? true : f.properties[filter] === true;
    });
    return false;
    });
    

// Function to retrieve the data and place on map.
function getData(mymap){
    console.log("in getData, before ajax");
    var mydata;
    var geojsonMarkerOptions = {
        radius: 10,
        fillColor: "#faf357",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    //load the data
    $.ajax("data/map2.geojson", {
        dataType: "json",
        success: function (response) {
            console.log(response);
            mydata = response;
            //call function to create proportional symbols
            //createPropSymbols(mydata)}
            //create a leaflet geojson layer and add to map.
            L.geoJson(mydata, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }}).addTo(mymap);
        }});
    console.log("in getData, after ajax");
};

L.geoJson(mydata, {
                //onEachFeature: onEachFeature
                onEachFeature: onEachFeature}).addTo(mymap);

L.geoJson(mydata, {
                //onEachFeature: onEachFeature
                filter: function(feature, layer) {
                    return feature.properties.yr2017>200;
                }
                }).addTo(mymap);

//create an L.markerClusterGroup layer
            var markers = L.markerClusterGroup();
            
            //loop through features to create markers and add to markerClusterGroup
            for (var i=0; i<mydata.features.length; i++) {
                var a = mydata.features[i];
                //add properties html string to each marker
                var properties = "";
                for (var property in a.properties){
                    properties += "<p>" + property + ": " + a.properties[property]+"</p>";
                };
                var marker = L.marker(new L.LatLng(a.geometry.coordinates[1], a.geometry.coordinates[0]), { properties: properties});
                //add a popup for each marker
                marker.bindPopup(properties);
                //add marker to markerClusterGroup
                markers.addLayer(marker);
            }
            //add markerClusterGroup to map
            map.addlayer(markers);
        }
    });
};

var geojsonMarkerOptions = {
        radius: 10,
        fillColor: "#faf357",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    
    
//build popup content string
    var popupContent = "<p><b>State:</b> " + feature.properties.StateName + "</p><p><b>" + "</p>";
    
    //add formatted attribute to popup content string
    var year = attribute.split("r")[1];
    popupContent += "<p>Avg. Yield in " + year+ ":</b> " + feature.properties[attribute] +" bu/ac</p>";
    
    //bind popup to circle marker
    layer.bindPopup(popupContent);
    
//To make tool tip, hover popups, Ex2.4 from lab inst 1-2
//Works with raster images but not vector/points like this lab.
var layer = L.marker(latlng, {
title:feature.properties.StateName
});

//build popup content string
    var popupContent = "<p><b>State:</b> " + feature.properties.StateName + "</p><p><b>" + "</p>";


$('.range-slider').on('input', function(){
        var index = $(this).val();


//add state to popup content string
            //var popupContent = "<p><b>State:</b> " + props.StateName + "</p>";
            
            //add formatted attribute to panel content string
            //var year = attribute.split("r")[1];
            //popupContent += "<p><b>Avg. Yield in " + year+ ":</b> " + props[attribute] +" bu/ac</p>";
            
            //replace the layer popup
            //layer.bindPopup(popupContent, {
            //    offset: new L.Point(0, -radius)
            //});

*/