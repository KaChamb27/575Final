/* NVF Project. */

//Function to reopen the layer table of contents
function openNav() {
    console.log("clicked open");
    editing = false;
    console.log('editing:', editing);
    document.getElementById("panel_border").style.width = "350px";
    $("#map_border").css('background-color', '#999999');
    $("#panel_title").html('Nels-Vale Farm');
    $("#map_title").html('');
    $("#map_text").html('');
}


//Function to hide the layer table of contents
function closeNav() {
    console.log("clicked close");
    document.getElementById("panel_border").style.width = "0";
    $("#map_border").css('background-color', 'white');
    $("#panel_title").html('');
    $("#map_title").html('Nels-Vale Farm');
    $("#map_text").html('Click on displayed parcel for info.');
}

//Capitalize first letter of strings
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Form actions
var api_key = 'IhthB5sCJTyIhOyqcopbiw';
var srchObj;

(function() {
    'use strict';
 
    //Main function to instantiate a map object
    function initialize() {
        map = L.map('map', {
            center: [43.106, -89.99],
            zoom: 15.45,
            minZoom: 10,
            zoomControl: false
        });
        L.Control.zoomHome().addTo(map);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);
    }
    
    //JSON for colors
    var colorCodes = {
        'hay' : '#BDFF55',
        'corn' : '#CCA326',
        'soybeans' : '#CCBB36',
        'oats' : '#2F727F',
        'seeding' : '#48FF1A',
        'canary grass' : '#597F0A',
        'grass' : 'yellow',
        'forest' : 'green',
        'boundary' : 'red',
        'waterway' : 'teal',
        'road' : 'yellow',
        'developed' : 'purple',
        'creekbed' : 'blue',
        'water' : 'blue'
    }

    
    
    /**
     * Function for generating an SQL statement
     * that selects all features for a layer
     * @param layer CartoDB layer name
     * @returns {string} SQL Query statement
     */
    function get_sql_query(layer) {
        if (layer === 'nvfdata' || layer === 'notes' || layer === 'nvfboundary') {
            return 'SELECT * FROM ' + layer + '&api_key=' + api_key;
        } else {
            return "SELECT * FROM nvfdata WHERE name = '"  + layer +"&api_key=" + api_key;
        };
    }


    function updateMap(selfR) {
            var mapStyle = selfR.value;
            console.log("in updateMap: "+mapStyle);

            if (mapStyle === "satellite") {
                L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    maxZoom: 19,
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                }).addTo(map);
            } else if (mapStyle === "terrain") {
                var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
                }).addTo(map);
            };
        }
    
    /**
     * Function to create a simple popup
     * @param feature Current feature
     * @param id Element ID for selected layer
     * @returns {L.popup} Popup object for the feature
     */
    function createPopup(feature, id) {
        // TODO make popup unique by layer and show everything
        var prop = feature.properties;
        if (id === 'nvfdata') {
            if (prop.landtype === "field") {
                return L.popup().setContent('<p style="font-size:12px"><b>Name: </b>' + prop.name + 
                                        '<br><b>Type: </b>' + capitalizeFirstLetter(prop.landtype) + 
                                        '<br><b>ID Local: </b>' + prop.idlocal +
                                        '<br><b>ID USDA: </b>' + prop.idusda +
                                        '<br><b>Size(ac): </b>' + prop.sizeac + 
                                        '<br><b>Soil: </b>' + capitalizeFirstLetter(prop.soiltype) + 
                                        '<br><br><b>2016: </b>' + capitalizeFirstLetter(prop.cropyr16) + '<b> Yield: </b>0'+ //+ prop.yield16 + 
                                        '<br><b>2017: </b>' + capitalizeFirstLetter(prop.cropyr17) + '<b> Yield: </b>0'+ //+ prop.yield17 +
                                        '<br><b>2018: </b>' + capitalizeFirstLetter(prop.cropyr18) + '<b> Yield: </b>0</p>'); //+ prop.yield18 +
                                        
            } else if (prop.landtype === "pasture") {
                return L.popup().setContent('<p style="font-size:12px"><b>Name: </b>' + prop.name + 
                                        '<br><b>Type: </b>' + capitalizeFirstLetter(prop.landtype) + 
                                        '<br><b>ID Local: </b>' + prop.idlocal +
                                        '<br><b>Cover: </b>' + capitalizeFirstLetter(prop.pstrcover) +
                                        '<br><b>Size(ac): </b>' + prop.sizeac + '</p>');
            } else {
                return L.popup().setContent('<p style="font-size:12px"><b>Name: </b>' + prop.name + 
                                        '<br><b>Other Type: </b>' + capitalizeFirstLetter(prop.othrtype) + 
                                        '<br><b>ID Local: </b>' + prop.idlocal +
                                        '<br><b>Cover: </b>' + capitalizeFirstLetter(prop.othrcover) +
                                        '<br><b>Size(ac): </b>' + prop.sizeac + '</p>');
            }
            
                                        
                
        } else if (id === 'notes'){
            return L.popup().setContent('<p style="font-size:12px"><b>Type: </b>' + prop.note_type + '<br><b>Message: </b>' + prop.note_msg+'</p>');
        } else {
            if (prop.type === null) {
                return L.popup().setContent('<p style="font-size:12px"><b>Type: </b>upland</p>');
            }
            return L.popup().setContent('<p style="font-size:12px"><b>Type: </b>' + prop.type + '</p>');
        }
    }


    /**
     * Function to build the HTML data for the current
     * layer's select box
     * @param final_set Set of unique features to populate the select box
     * @param id Element ID for the current layer
     */
    function build_query_combo(final_set, id) {
        var combo_html = '<select id="' + id + '_combo">';
        if (id==='nvfdata'){
            var middle = '<option value="" disabled selected style="display: none;">- Choose Type -</option>';
        } else if (id ==='byName') {
            var middle = '<option value="" disabled selected style="display: none;">- Choose Name -</option>';
        } else if (id ==='byUSDA') {
            var middle = '<option value="" disabled selected style="display: none;">- Choose USDA ID -</option>';
        }
        var final_array = Array.from(final_set);
        
        for (var i in final_array) {
            // middle += final_set[i];
            middle += '<option value="' + final_array[i] + '">' + final_array[i] + "</option>";
        }
        combo_html += middle + "</select>";
        $(combo_html).appendTo("#" + id + '_div');
    }


    /**
     * Function to build the select box for the
     * currently checked layer
     * @param features All current features for the selected layer
     * @param id Element ID for the selected layer
     */
    function get_features(features, id) {
        //console.log("new_layers: ", features, "ID: ",id); //display rows
        //console.log("ID: "+id);
        var query_set = new Set();
        features.forEach(function(feature) {
            if (id === 'nvfdata') {
                query_set.add(capitalizeFirstLetter(feature.properties.landtype));
            } else if (id === 'notes') {
                query_set.add(feature.properties.note_type);
            } else if (id === 'nvfboundary') {
                //console.log("in bndry");
                //query_set.add(feature.properties.id);
            } else if (id ==='byName') {
                query_set.add(feature.properties.name);
            } else if (id ==='byUSDA'){
                query_set.add(feature.properties.idusda);
            } else {
                console.log("Error in set");
            };
        });
        build_query_combo(query_set, id);
    }


    /**
     * Main function to load data if a layer's
     * checkbox is checked
     * @param self Current checkbox object to pass to AJAX
     */
    function load_data(self, idS, srchObj) {
        //console.log('sql: '+self.id);
        console.log('start load_data: '+srchObj);
        $.getJSON(base_url + get_sql_query(self.id), function(data) {
            console.log(data); //Displays GeoJSON data
            var dataA = data;
            //console.log(dataA.features[0].properties.name);

            // TODO Create dropdown options for querying                
            get_features(data.features, idS);
            //console.log(idS);
            var combo_id='';
            if (idS==="byName"||idS==="byUSDA"){
                // register select box onchange
                 combo_id = '#search_combo';
            } else {
                // register select box onchange
                combo_id = '#' + self.id + '_combo';
            }
            // register select box onchange
            //var combo_id = '#' + self.id + '_combo';
            console.log("combo_id: "+combo_id);
            $(combo_id).change(function() {
                console.log("in change");
                filter_data(this, self.id); //Not being run...?
            });

            var new_layers;
            var data_type = data.features[0].geometry.type;
            if (data_type === 'Point') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, self.id), {className: 'popup_data'});
                    },
                    id: self.id,
                    pointToLayer: function (feature, latlng) {
                        var geojsonMarkerOptions = {
                            radius: 8,
                            fillColor: colorCodes[self.id],
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        };
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    }
                });
            } else if (data_type === 'MultiLineString') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, self.id), {className: 'popup_data'});
                    },
                    id: self.id,
                });
            } else if (data_type === 'Polygon' || data_type === 'MultiPolygon') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, self.id));
                    },
                    id: self.id,
                    style: function (feature) { 
                        //Sets color of assets features
                        if (feature.properties.name==='Boundary'){
                            return {color: "grey"};
                        } else if (capitalizeFirstLetter(feature.properties.landtype) === 'Field') {
                            return {color: "#F2EE16"};
                        } else if (capitalizeFirstLetter(feature.properties.landtype) === 'Pasture') {
                            return {color: "#63A807"};
                        } else if (capitalizeFirstLetter(feature.properties.landtype) === 'Other') {
                            return {color: "#307B87"};
                        } else {
                            return {color: "#000"};
                        }
                    }
                });
            }
            new_layers.addTo(map);
            
            $('#searchbtn').on("click",function() {
                //console.log(dataA.features[0].properties.name);//Bottom 8
                console.log(srchObj);
                L.geoJSON(dataA, {
                    filter: function(feature, layer){
                        console.log(feature.properties);
                        if (feature.properties.name===srchObj){ console.log("here");
                        } else { console.log("not yet"); }
                    }}).addTo(map);
            });
            //console.log("Value: "+srchObj);
            //createLegend(map, data.features);
            //searchAssets(map, data.features);
        });
    }


    //Layer events and logic //https://knelson4.carto.com/builder/d9d73fb3-38e8-4dd8-8b69-f8394163a7b2/embed

    var base_url = 'https://knelson4.carto.com/api/v2/sql?format=GeoJSON&q=';
    
    $("input:checkbox").change(function() {
        console.log('ID: ' + this.id);

        if ($(this).is(":checked")) {
            console.log($('#' + this.id).is(':checked')); //returns "true"
            var selfC = this;
            if (this.id==="nvfdata") {
                var idD = "nvfdata";
            } else if (this.id==="nvfboundary") {
                var idD = "nvfboundary";
            };
            load_data(selfC, idD, srchObj);
        } else {
            console.log($('#' + this.id).is(':checked'));
            remove_data(this.id);

            // remove combo boxes
            $('#' + this.id + '_combo').remove();

        }
    });
    
    $("input:radio").change(function() {
        //console.log('ID: '+this.id); //returns ID: basemap
        
        if ($(this).is(":checked")&& this.id==='basemap') {
            //console.log($('#'+ this.id).is(':checked')); //returns false but should be true?..
            var selfR = this;
            updateMap(selfR);
        } else if ($(this).is(":checked")&& this.id==='search'){
            //search
            var searchSlctn = this;
            searchAssets(searchSlctn);
        };
    });
    
    $('#notebtn').on("click", function() {
        alert('Note submitted!');
        console.log("note submitted...");
    });

    /**
     * Remove the layer associated with the
     * checkbox that was unchecked
     */
    function remove_data(id) {
        var layer_list = map._layers;
        for (var layer in layer_list) {
            if (layer_list[layer].options.id === id) {
                map.removeLayer(layer_list[layer]);
            }
        }
    }


    /**
     * Same as load_data() but filters based on
     * the select box value for the layer checked
     * @param select_box Current layer's select box object
     * @param id Element ID for the current layer that is checked
     */
    function filter_data(select_box, id) {
        // remove all current data for the selected layer
        remove_data(id);
        console.log("in filter: "+select_box);
        
        $.getJSON(base_url + get_sql_query(id), function(data) {
            var data_type = data.features[0].geometry.type;
            var new_layers;
            if (data_type === 'Point') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, id), {className: 'popup_data'});
                        //layer.on('click', highlightParcel);
                    },
                    id: id,
                    pointToLayer: function (feature, latlng) {
                        var geojsonMarkerOptions = {
                            radius: 8,
                            fillColor: colorCodes[id],
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        };
                        return L.circleMarker(latlng, geojsonMarkerOptions);
                    },
                    filter: function(feature, layer) {
                        console.log("filter notes");
                        if (id==='notes'){
                            return feature.properties.note_type === select_box.value;
                        } else {
                            return feature.properties.type === select_box.value;
                        };
                    }
                });
            } else if (data_type === 'MultiPolygon') {
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, id));
                        //layer.on('click', highlightParcel);
                    },
                    id: id,
                    style: function (feature) {
                        if (capitalizeFirstLetter(feature.properties.landtype) === 'Field') {
                            return {color: colorCodes[feature.properties.cropyr18]};
                        } else if (capitalizeFirstLetter(feature.properties.landtype) === 'Pasture') {
                            return {color: colorCodes[feature.properties.pstrcover]};
                        } else if (capitalizeFirstLetter(feature.properties.landtype) === 'Other') {
                            return {color: colorCodes[feature.properties.othrtype]};
                        }
                        else {return {color: "#ff6689"};} 
                    },
                    filter: function(feature, layer) {
                            return capitalizeFirstLetter(feature.properties.landtype) === select_box.value;
                        }
                    });
            }
            console.log(id);
            new_layers.addTo(map);
        });
    }
    /*
    //Update legend with attribute
    function updateLegend(map, attribute){
        console.log(attribute[0].properties.cropyr16);
        //content text
        //var year = attribute.properties.split("cropyr")[1];
        //console.log("year: "+year);
        var content = "Legend";
        //replace legend content
        $('#legend').html(content);
        //get max,mean,min values
        //var circleValues = getCircleValues(mymap, attribute);
        /*for (var key in circleValues){
            //get radius
            var radius = calcPropRadius(circleValues[key]);
            //assign cy and r attributes
            $('#'+key).attr({
                cy:59-radius,
                r: radius
            });
            //add legend text
            $('#'+key+'-text').text(Math.round(circleValues[key])+" bu/ac");
        };
    };
    
    //Create Legend
    function createLegend(map, data){
        console.log("create legend");
        var LegendControl = L.Control.extend({
            options: {
            position: 'bottomright'
            },
        onAdd: function(map){
            //create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');
            //Create temporal legend
            $(container).append('<div id="legend">');
            return container;
        }});
        map.addControl(new LegendControl());
        updateLegend(map, data);
        };  */
    
    //Search Function
    function searchAssets(searchSlctn) {
        console.log("in searchAssets");
        var srch = searchSlctn.value;
        console.log("Search: "+srch);
        //remove the previously checked combo boxes
        if (srch==="byName") {
            $('#byUSDA_combo').remove(); 
        } else if (srch==="byUSDA") {
            $('#byName_combo').remove();
        };
        //access the row data from table
        var idS = srch;
        //srchObj = new String();
        srchObj = $('#'+srch+'_combo option:selected').text();
        console.log("srchObj: "+srchObj);
        
        load_data(nvfdata, idS, srchObj);
        
        //var combo_id='';
        
            //var idF = 'nvfdata';
            
            //$('#leaflet-popup-content').filter('<p>Name: '+srchObj, function() {
            //    console.log("here");
            //});
            
            /*
            var colName = '';
            if (srch==="byName") {
                colName = "name";
            } else if (srch==="byUSDA") {
                colName = "idusda"
            };
            */
            
            
            /*
            var searchSql = "SELECT * FROM nvfdata WHERE "+colName+" = "+searchHtml+"&api_key="+api_key;
            //console.log("in search change: "+);
            var id = 'nvfdata'
            // remove all current data for the selected layer
            remove_data(id);
        
            $.getJSON(base_url + searchSql, function(data) {
                var new_layers;
            
                new_layers = L.geoJSON(data, {
                    onEachFeature: function (row, layer) {
                        layer.bindPopup(createPopup(row, id));
                        //layer.on('click', highlightParcel);
                    },
                    id: id,
                    style: 'color: "#ff6689"'
                    });
                new_layers.addTo(map);
            });*/
    }
                       
    /* var highlight = {
    'color': '#333333',
    'weight': 2,
    'opacity': 1
    };*/
    /*
    //Highlight selected parcel
    function highlightParcel(e) {
        console.log(map._layers);
        //change stroke
        map._layers.setStyle(highlight);
    }
    
    //function to reset the element style on mouseout
    function dehighlight(props){
        var selected = d3.selectAll("."+props.COUNTYNAME)
            .style("stroke", function(){
                return getStyle(this, "stroke")
            })
            .style("stroke-width", function(){
                return getStyle(this, "stroke-width")
            });
        
        function getStyle(element, styleName){
            var styleText = d3.select(element)
                .select("desc")
                .text();
            
            var styleObject = JSON.parse(styleText);
            
            return styleObject[styleName];
        };
        
        //remove label
        d3.select(".infolabel")
            .remove();
    } */
    
    //Submit note
    function submitNote () {
        //var note = getElementById("")
        console.log("in submitNote");
        
    }

    $(document).ready(initialize());
})();