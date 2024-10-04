/**
Author:    Build Rise Shine with Nyros (BRS)
Created:   11.05.2022
Library / Component: Script file
Description: Logic behind the app(fetching the data from the API)
(c) Copyright by BRS with Nyros.
**/

let chathams_blue = '#1A4B84';
mapboxgl.accessToken = 'pk.eyJ1IjoicGFyaXNyaSIsImEiOiJja2ppNXpmaHUxNmIwMnpsbzd5YzczM2Q1In0.8VJaqwqZ_zh8qyeAuqWQgw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [80.18536880746353, 16.501575031841256],
    zoom: 13
});

// Add the control to the map.
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: 'Search any place on the planet'
});

// Add the control to the map.
var geolocate = new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
});

map.addControl(geolocate);
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());
map.addControl(geocoder);
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Draggable marker
var marker = new mapboxgl.Marker({
    draggable: true
})
.setLngLat([80.18536880746353, 16.501575031841256])
.addTo(map);

function onDragEnd() {
    var lngLat = marker.getLngLat();
    coordinates.style.display = "block";
    coordinates.innerHTML = "Longitude: " + lngLat.lng + "<br />Latitude: " + lngLat.lat;

    // Add a popup on drag end with the coordinates
    new mapboxgl.Popup()
        .setLngLat(lngLat)
        .setHTML(`<p>Marker dropped at:</p><p>Longitude: ${lngLat.lng}</p><p>Latitude: ${lngLat.lat}</p>`)
        .addTo(map);

    // Save the marker coordinates to localStorage
    localStorage.setItem('markerPosition', JSON.stringify([lngLat.lng, lngLat.lat]));
}
marker.on("dragend", onDragEnd);

// Load saved marker position
if (localStorage.getItem('markerPosition')) {
    let savedPosition = JSON.parse(localStorage.getItem('markerPosition'));
    marker.setLngLat(savedPosition);
}

// Switch map styles
var layerList = document.getElementById("menu");
var inputs = layerList.getElementsByTagName("input");

function switchLayer(layer) {
    var layerId = layer.target.id;
    map.setStyle("mapbox://styles/mapbox/" + layerId);
}
for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}

// Route planning using Mapbox Directions API
map.addControl(new MapboxDirections({
    accessToken: mapboxgl.accessToken
}), 'top-left');

// Measure distance between two points
let startPoint = null;
let endPoint = null;

map.on('click', function (e) {
    if (!startPoint) {
        startPoint = e.lngLat;
        new mapboxgl.Marker({ color: 'green' })
            .setLngLat(startPoint)
            .addTo(map);
    } else if (!endPoint) {
        endPoint = e.lngLat;
        new mapboxgl.Marker({ color: 'red' })
            .setLngLat(endPoint)
            .addTo(map);

        // Calculate distance
        let distance = turf.distance(startPoint, endPoint);
        alert(`Distance between points: ${distance.toFixed(2)} kilometers`);

        // Reset points for new measurements
        startPoint = null;
        endPoint = null;
    }
});

// Function to set the map theme color
function setTheme(theme) {
    document.documentElement.style.setProperty('--primary-color', theme);
    localStorage.setItem('map-theme', theme);
}
setTheme(localStorage.getItem('map-theme') || chathams_blue);
