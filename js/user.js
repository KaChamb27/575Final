/* Add user submitted notes of observations */

$('#add_notes').click(function() {
    var selected_notes = $('#obs').val();
    console.log("notes: ", selected_notes);

    if (($('#obs').val() === undefined) || ($('#obs').val() === null)) {
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
                var note = document.getElementById("note").value;
                console.log("note: " + note );
                var popup = '<b>Note:</b> ' + $('#obs').val() + '<br><b>Details:</b> '+ note + '<br><br><a id="popup_button">Remove</a>';
                notes_location.bindPopup(popup);
                notes_location.addTo(map);

                notes_location.on('popupopen', remove_user_point);

                editing = false;
                L.DomUtil.removeClass(map._container,'crosshair-cursor-enabled');
            }
            openNav();
        });
    }
});

function remove_user_point() {
    var marker = this;
    $("#popup_button:visible").click(function () {
        map.removeLayer(marker);
    });
}