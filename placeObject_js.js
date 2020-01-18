require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/WebScene",
], function (Map, SceneView, GraphicsLayer, SketchViewModel, WebScene) {

    var map = new Map({
        basemap: "topo-vector",
        ground: "world-elevation"  // show elevation
    });
    // click select symbol and then click on a point to place it, then wait for a while
    const view = new SceneView({
        container: "viewDiv",
        map: map, // replace with webscene for a scene\
        camera: {
            position: {  // observation point
                x: -118.80800,
                y: 33.96100,
                z: 25000 // altitude in meters
            },
            tilt: 65  // perspective in degrees
        }
    });

    const graphicsLayer = new GraphicsLayer();
    view.map.add(graphicsLayer);

    const solarPanelBtn = document.getElementById("solar");
    const sonticBtn = document.getElementById("tree");

    const sontic = {
        type: "point-3d",
        symbolLayers: [
            {
                type: "object",
                height: 10,
                resource: {
                    href: "./natureModels/tree.gltf"
                }
            }
        ]
    };

    view.when(function () {
        const sketchVM = new SketchViewModel({
            layer: graphicsLayer,
            view: view
        });

        solarPanelBtn.addEventListener("click", function () {
            // reference the relative path to the glTF model
            // in the resource of an ObjectSymbol3DLayer
            sketchVM.pointSymbol = {
                type: "point-3d",
                symbolLayers: [
                    {
                        type: "object",
                        resource: {
                            href:
                                "./natureModels/panel.gltf"
                        }
                    }
                ]
            };
            sketchVM.create("point");
            deactivateButtons();
            this.classList.add("esri-button--secondary");
        });

        sonticBtn.addEventListener("click", function () {
            // reference the relative path to the glTF model
            // in the resource of an ObjectSymbol3DLayer
            sketchVM.pointSymbol = sontic
            sketchVM.create("point");
            deactivateButtons();
            this.classList.add("esri-button--secondary");
        });

        
        sketchVM.on("create", function (event) {
            if (event.state === "complete") {
                sketchVM.update(event.graphic);
                deactivateButtons();
            }
        });
    }).catch(console.error);

    function deactivateButtons() {
        const elements = Array.prototype.slice.call(
            document.getElementsByClassName("esri-button")
        );
        elements.forEach(function (element) {
            element.classList.remove("esri-button--secondary");
        });
    }

    view.ui.add("paneDiv", "top-right");
});