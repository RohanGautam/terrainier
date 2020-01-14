var TILE_SIZE = 256;
var tileCoordinate, zoomLevel;
var marker;
var coordInfo;

init()
// TODO : save map state on reaload, using API maybe
// TODO : show model analysis data

function init() {
    loadMap()
    // link generateModel button with the API call. If you directly call generateModel(), 
    // then it will call it infinitely (every time the page refreshes)
    generateModelButton = document.getElementById("generateModelsButton");
    generateModelButton.onclick = generateModel
    
    coordInfo = document.getElementById("coordInfo");
    
}

async function generateModel() {
    var tilex = tileCoordinate.x;
    var tiley = tileCoordinate.y;
    console.log(`Current location ${tileCoordinate}, ${zoomLevel}`);
    // console.log(tileCoordinate);
    // console.log(zoomLevel);   
    if (zoomLevel < 15) {
        console.log("Terrain export is only available over zoom 15. Please zoom in more!");
    }
    else {
        console.log("Calling API..");
        const response = await fetch(`http://127.0.0.1:5000/run/${tilex}/${tiley}/${zoomLevel}`, { mode: 'cors' })
        const myJson = await response.json();
        console.log(myJson)
    }

}

async function loadMap() {
    console.log("Getting key..");
    const response = await fetch('http://127.0.0.1:5000/getApiKey', { mode: 'cors' })
    const key = await response.json();
    console.log(key)
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
    document.body.appendChild(script);
}


function initMap() {
    var singapore = new google.maps.LatLng(1.334, 103.847);

    var map = new google.maps.Map(document.getElementById('map'), {
        center: singapore,
        zoom: 3,
        gestureHandling: 'greedy'
    });

    marker = new google.maps.Marker({
        position: singapore,
        map: map,
        title: 'Drag me around!',
        draggable: true,
        animation: google.maps.Animation.DROP,
    });
    marker.setMap(map)

    tileCoordinate = getTileCoord(marker.getPosition())
    zoomLevel = map.getZoom()
    console.log(tileCoordinate, zoomLevel);

    google.maps.event.addListener(marker, 'mouseup', function () {
        updateMarkerLocation(map, marker)
    });

    map.addListener('zoom_changed', function () {
        updateMarkerLocation(map, marker)
    });
}

function updateMarkerLocation(map, marker) {
    zoomLevel = map.getZoom()
    currentLatLng = marker.getPosition()
    tileCoordinate = getTileCoord(currentLatLng, zoomLevel)
    console.log(tileCoordinate, zoomLevel);
    console.log("Updated! ^");
    coordInfo.innerHTML = `Latitude ${currentLatLng.lat()} Longitude ${currentLatLng.lng()}<br>tilex : ${tileCoordinate.x} tiley: ${tileCoordinate.y} zoom: ${zoomLevel}`
}

function getTileCoord(currentLatLng, zoom) {
    var scale = 1 << zoom;
    var worldCoordinate = project(currentLatLng);
    tileCoordinate = new google.maps.Point(
        Math.floor(worldCoordinate.x * scale / TILE_SIZE),
        Math.floor(worldCoordinate.y * scale / TILE_SIZE));
    return tileCoordinate;
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
    var siny = Math.sin(latLng.lat() * Math.PI / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
        TILE_SIZE * (0.5 + latLng.lng() / 360),
        TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
}