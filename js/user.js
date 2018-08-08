$('#add_notes').click(function() {
    var selected_notes = $('#notes').val();
    console.log("notes: ", selected_notes);

    if (($('#notes').val() === undefined) || ($('#notes').val() === null)) {
        alert('Choose a note type!');
    } else {
        L.DomUtil.addClass(map._container,'crosshair-cursor-enabled');
        closeNav();

        // toggle attribute to control map clicking
        editing = true;
        console.log('editing:', editing);

        var obsicon = L.icon({
            iconUrl: 'img/green-circle.png',
            iconSize:     [20, 20], // size of the icon
            iconAnchor:   [7, 5], // point of the icon which will correspond to marker's location
            popupAnchor:  [5, -5], // point from which the popup should open relative to the iconAnchor
            id: 'notes_location'
        });

        var notes_location;
        map.on('click', function(location) {
            if (editing) {
                notes_location = new L.marker(location.latlng, {
                    icon: obsicon,
                    draggable: true,
                    opacity: 1
                });
                var popup = '<b>Note:</b> ' + $('#notes').val() + '<br><br><a id="popup_button">Remove</a>';
                notes_location.bindPopup(popup);
                notes_location.addTo(map);
                console.log(notes_location);

                notes_location.on('popupopen', remove_user_point);

                editing = false;
                L.DomUtil.removeClass(map._container,'crosshair-cursor-enabled');
            }
        });
    }
});

function remove_user_point() {
    var marker = this;
    $("#popup_button:visible").click(function () {
        map.removeLayer(marker);
    });
}