var solarNum = 0;
var treeNum = 0;
var roi = 0;

require([
  'esri/Map',
  'esri/views/SceneView',
  'esri/layers/GraphicsLayer',
  'esri/widgets/Sketch/SketchViewModel',
  'esri/WebScene'
], function(Map, SceneView, GraphicsLayer, SketchViewModel, WebScene) {
  var map = new Map({
    basemap: 'topo-vector',
    ground: 'world-elevation' // show elevation
  });
  // click select symbol and then click on a point to place it, then wait for a while
  const view = new SceneView({
    container: 'viewDiv',
    map: map, // replace with webscene for a scene\
    camera: {
      position: {
        // observation point
        x: -118.808,
        y: 33.961,
        z: 25000 // altitude in meters
      },
      tilt: 65 // perspective in degrees
    }
  });

  const graphicsLayer = new GraphicsLayer();
  view.map.add(graphicsLayer);

  const solarPanelBtn = document.getElementById('solar');
  const sonticBtn = document.getElementById('tree');

  const tree = {
    type: 'point-3d',
    symbolLayers: [
      {
        type: 'object',
        height: 10,
        resource: {
          href: './natureModels/tree.gltf'
        }
      }
    ]
  };

  const panel = {
    type: 'point-3d',
    symbolLayers: [
      {
        type: 'object',
        resource: {
          href: './natureModels/panel.gltf'
        }
      }
    ]
  };

  view
    .when(function() {
      const sketchVM = new SketchViewModel({
        layer: graphicsLayer,
        view: view
      });

      solarPanelBtn.addEventListener('click', function() {
        // reference the relative path to the glTF model
        // in the resource of an ObjectSymbol3DLayer
        sketchVM.pointSymbol = panel;
        sketchVM.create('point');
        deactivateButtons();
        this.classList.add('esri-button--secondary');
        solarNum += 1;
        updateStats();
      });

      sonticBtn.addEventListener('click', function() {
        // reference the relative path to the glTF model
        // in the resource of an ObjectSymbol3DLayer
        sketchVM.pointSymbol = tree;
        sketchVM.create('point');
        deactivateButtons();
        this.classList.add('esri-button--secondary');
        treeNum += 1;
        updateStats();
      });

      sketchVM.on('create', function(event) {
        if (event.state === 'complete') {
          sketchVM.update(event.graphic);
          deactivateButtons();
        }
      });
    })
    .catch(console.error);

  function deactivateButtons() {
    const elements = Array.prototype.slice.call(
      document.getElementsByClassName('esri-button')
    );
    elements.forEach(function(element) {
      element.classList.remove('esri-button--secondary');
    });
  }

  view.ui.add('paneDiv', 'top-right');
});

// estimates in SGD:
var costPerTree = 50;
var costPerpanel = 190;
var budget = 20000;
//todo: ROI
var sampleSuggestion =
  'You seem to be in a dense residential area .. try adding more solar panels for long term returns';

document.getElementById('treeNum').innerHTML = treeNum;
document.getElementById('solarNum').innerHTML = solarNum;

function updateStats() {
  document.getElementById('treeNum').innerHTML = treeNum;
  document.getElementById('solarNum').innerHTML = solarNum;
  document.getElementById('co2num').innerHTML = 17 * treeNum;
  roi = (solarNum * costPerpanel) / (solarNum * 0.24 * 397) - solarNum * 0.03;
  console.log(roi);
  if (roi.toFixed(2) > 0) {
    document.getElementById('roiNum').innerHTML = roi.toFixed(2);
  } else {
    document.getElementById('roiNum').innerHTML = 0;
  }
  var moneySpent = treeNum * costPerTree + solarNum * costPerpanel;
  var remaining = budget - moneySpent;
  document.getElementById(
    'moneyInfo'
  ).innerHTML = `Budget : ${budget}$<br>Total costs : ${moneySpent}$<br>Remaining : ${remaining}$`;
  document.getElementById('sampleSuggestion').innerHTML = sampleSuggestion;
}
