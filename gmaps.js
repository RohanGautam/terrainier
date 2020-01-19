var TILE_SIZE = 256;
var tileCoordinate, zoomLevel, currentLatLng;
var marker;
var coordInfo;
var aqiLevel;
var waterLevel;

init();
// TODO : save map state on reaload, using API maybe
// TODO : show model analysis data

function init() {
  loadMap();
  getAndUpdateAnalysisResult();
  // link generateModel button with the API call. If you directly call generateModel(),
  // then it will call it infinitely (every time the page refreshes)
  generateModelButton = document.getElementById('generateModelsButton');
  generateModelButton.onclick = generateModel;

  coordInfo = document.getElementById('coordInfo');
  aqiLevel = document.getElementById('aqi-index');
  aqiBox = document.getElementById('aqi');

  waterLevel = document.getElementById('water-index');
  waterBox = document.getElementById('water-table');
}

async function getPreviousPos() {
  const response = await fetch(`http://127.0.0.1:5000/getLastPosition`, {
    mode: 'cors'
  });
  const json = await response.json();
  console.log(json);

  if (json == 'False') {
    return false;
  } else {
    var lat = parseFloat(json['lat']);
    var long = parseFloat(json['long']);
    console.log(`LATLONG ${lat}, ${long}`);
    return json;
    // return [lat, long]
    // currentLatLng = new google.maps.LatLng(lat, long)
    //add marker to position
  }
}

async function getAndUpdateAnalysisResult() {
  const response = await fetch(`http://127.0.0.1:5000/getAnalysisResult`, {
    mode: 'cors'
  });
  const json = await response.json();
  // return json;
  if (json != 'False') {
    var result = document.getElementById('analysisResult');
    var pbar = document.getElementById('pbar');
    var buildingTopArea = json['FlatSurfaceArea'];
    var totalArea = json['TotalArea'];
    result.innerHTML = `Analysis result:<br>BuildingTop area : ${buildingTopArea}, Total area : ${totalArea}`;
    var percent = (buildingTopArea/totalArea)*100;
    pbar.style = `width : ${percent}%`
    
  }
}

async function generateModel() {
  var tilex = tileCoordinate.x;
  var tiley = tileCoordinate.y;
  console.log(`Current location ${tileCoordinate}, ${zoomLevel}`);
  // console.log(tileCoordinate);
  console.log(zoomLevel);
  if (zoomLevel < 15) {
    console.log(
      'Terrain export is only available over zoom 15. Please zoom in more!'
    );
  } else {
    console.log('Calling API..');
    const response = await fetch(
      `http://127.0.0.1:5000/run/${tilex}/${tiley}/${zoomLevel}/${currentLatLng.lat()}/${currentLatLng.lng()}`,
      { mode: 'cors' }
    );
    const myJson = await response.json();
    console.log(myJson);
  }
}

async function loadMap() {
  console.log('Getting key..');
  const response = await fetch('http://127.0.0.1:5000/getApiKey', {
    mode: 'cors'
  });
  const key = await response.json();
  console.log(key);
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
  document.body.appendChild(script);
}

async function initMap() {
  var pos, map;
  var prev = await getPreviousPos();
  if (prev == false) {
    pos = new google.maps.LatLng(1.334, 103.847); // Singapore
    map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: 3,
      gestureHandling: 'greedy'
    });
    tileCoordinate = getTileCoord(pos);
  } else {
    pos = new google.maps.LatLng(prev['lat'], prev['long']);
    currentLatLng = pos;
    map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: parseInt(prev['zoom']),
      gestureHandling: 'greedy'
    });
    tileCoordinate = new google.maps.Point(
      parseInt(prev['tilex']),
      parseInt(prev['tiley'])
    );
  }

  marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: 'Drag me around!',
    draggable: true,
    animation: google.maps.Animation.DROP
  });
  marker.setMap(map);

  zoomLevel = map.getZoom();
  console.log(tileCoordinate, zoomLevel);
  // if (currentLatLng != undefined) {
  //   showPositionInfo(
  //     tileCoordinate.x,
  //     tileCoordinate.y,
  //     zoomLevel,
  //     currentLatLng.lat(),
  //     currentLatLng.lng()
  //   );
  // }

  google.maps.event.addListener(marker, 'mouseup', function() {
    updateMarkerLocation(map, marker);
  });

  map.addListener('zoom_changed', function() {
    updateMarkerLocation(map, marker);
  });
}

// function showPositionInfo(tilex, tiley, zoom, lat, long) {
//   coordInfo.innerHTML = `Latitude ${lat} Longitude ${long}<br>tilex : ${tilex} tiley: ${tiley} zoom: ${zoom}`;
// }

function updateMarkerLocation(map, marker) {
  zoomLevel = map.getZoom();
  var oldLatLng = currentLatLng;
  currentLatLng = marker.getPosition();
  tileCoordinate = getTileCoord(currentLatLng, zoomLevel);
  console.log(tileCoordinate, zoomLevel);
  console.log('Updated! ^');
  // showPositionInfo(
  //   tileCoordinate.x,
  //   tileCoordinate.y,
  //   zoomLevel,
  //   currentLatLng.lat(),
  //   currentLatLng.lng()
  // );

  if (zoomLevel < 15) {
    generateModelButton.classList.add('disabled');
  } else {
    generateModelButton.classList.remove('disabled');
  }

  if (oldLatLng !== currentLatLng) {
    water = Math.floor(Math.random() * 300 + 1);
    waterLevel.innerHTML = water;
    if (water <= 50) {
      waterBox.style.backgroundColor = '#FE1603';
    } else if (water > 50 && water <= 100) {
      waterBox.style.backgroundColor = '#FE7103';
    } else if (water > 100 && water <= 150) {
      waterBox.style.backgroundColor = '#F7D209';
    } else if (water > 150 && water <= 200) {
      waterBox.style.backgroundColor = '#08E6F7';
    } else if (water > 200 && water <= 300) {
      waterBox.style.backgroundColor = '#0DA8E3';
    } else {
      waterBox.style.backgroundColor = '#0D26E3';
    }

    axios
      .get(
        'https://api.waqi.info/feed/geo:' +
          currentLatLng.lat() +
          ';' +
          currentLatLng.lng() +
          '/?token=' +
          AQI_KEY,
        null,
        null
      )
      .then(response => {
        const data = response.data.data;
        aqi = data.aqi;
        aqiLevel.innerHTML = aqi;
        if (aqi <= 50) {
          aqiBox.style.backgroundColor = '#00ff4c';
        } else if (aqi > 50 && aqi <= 100) {
          aqiBox.style.backgroundColor = '#e1ff00';
        } else if (aqi > 100 && aqi <= 150) {
          aqiBox.style.backgroundColor = '#ffae00';
        } else if (aqi > 150 && aqi <= 200) {
          aqiBox.style.backgroundColor = '#ff000d';
        } else if (aqi > 200 && aqi <= 300) {
          aqiBox.style.backgroundColor = '#850099';
        } else {
          aqiBox.style.backgroundColor = '#800000';
        }
      })
      .catch(error => console.error('Error in getting AQI', error));
      var jugad = Math.floor((Math.random() * 3) + 1);
      var suggestions = ''
      if(jugad == 1) {
          suggestions+="<li>Build more solar panels</li>";
          } else if(jugad == 2){
            suggestions+="<li>Build more rainwater harvesters</li>";
          } else if(jugad == 3){
            suggestions+="<li>Build more windmills</li>";
          }else if(aqi > 100 || water < 150){
            suggestions+="<li>Plant more trees</li>";
          }else if(aqi > 100 || water < 150){ //ROHAN CHANGE THIS LINE TO If (Ratio of trees/roads<0.6) == plant more trees
            suggestions+="<li>Plant more trees</li>";
          }
      var sug = document.getElementById("dynamic_sug");
      sug.innerHTML = suggestions;
  }
}

function getTileCoord(currentLatLng, zoom) {
  var scale = 1 << zoom;
  var worldCoordinate = project(currentLatLng);
  tileCoordinate = new google.maps.Point(
    Math.floor((worldCoordinate.x * scale) / TILE_SIZE),
    Math.floor((worldCoordinate.y * scale) / TILE_SIZE)
  );
  return tileCoordinate;
}

// The mapping between latitude, longitude and pixels is defined by the web
// mercator projection.
function project(latLng) {
  var siny = Math.sin((latLng.lat() * Math.PI) / 180);

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  siny = Math.min(Math.max(siny, -0.9999), 0.9999);

  return new google.maps.Point(
    TILE_SIZE * (0.5 + latLng.lng() / 360),
    TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
  );
}

async function Export() {
  //URL of Google Static Maps.
  var staticMapUrl = 'https://maps.googleapis.com/maps/api/staticmap';

  //Set the Google Map Center.
  staticMapUrl += '?center=' + currentLatLng.lat() + ',' + currentLatLng.lng();

  //Set the Google Map Size.
  staticMapUrl += '&size=600x900';

  //Set the Google Map Zoom.
  staticMapUrl += '&zoom=' + zoomLevel;

  //Set the Google Map Type.
  staticMapUrl += '&maptype=satellite';

  //Set the Google Map Type.
  staticMapUrl += '&key=AIzaSyDa-jfxlbmgzT5SZx5TLLOQU9CpeLk6S6k';

  //Display the Image of Google Map.
  var imgMap = document.getElementById('element-out');
  imgMap.src = staticMapUrl;
  imgMap.style.display = 'block';

  // console.log("BEANS");
  
  // const response = await fetch(`http://127.0.0.1:5000/getImage/${currentLatLng.lat()}/${currentLatLng.lng()}/${zoomLevel}`, {
  //   mode: 'cors'
  // });
  // const json = await response.json();
  // console.log(json);
  // document.getElementById('colorInfo').innerHTML = json
  // var a = document.getElementById('dynamic_link');
  // a.href = staticMapUrl;
}
