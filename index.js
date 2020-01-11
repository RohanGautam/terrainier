import THREE, { PerspectiveCamera, Scene, AmbientLight, PointLight, LoadingManager, WebGLRenderer } from 'three';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

var container, canvas;
var container2, canvas2;
var camera, material_scene, renderer, controls;
var camera2, original_scene, renderer2, controls2;
var width, height;


init();
animate();
function init() {
    width = 500, height = 500;
    // width = window.innerWidth, height = window.innerHeight;

    /** Scene 1 setup */
    container = document.getElementById('materialObjViewer');
    canvas = document.getElementById("materialObjViewerCanvas");
    
    camera = new PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = 250;

    material_scene = new Scene();
    var ambientLight = new AmbientLight(0xcccccc, 0.4);
    material_scene.add(ambientLight);
    var pointLight = new PointLight(0xffffff, 0.8);
    pointLight.position.set(100,100,100)
    pointLight.castShadow = true;
    // camera.add(pointLight);
    material_scene.add(pointLight);
    material_scene.add(camera);

    /** Scene 2 setup*/
    container2 = document.getElementById('objViewer');
    canvas2 = document.getElementById("objViewerCanvas");
    
    original_scene = new Scene();
    var ambientLight2 = new AmbientLight(0xcccccc, 0.4);
    original_scene.add(ambientLight2);
    var pointLight2 = new PointLight(0xffffff, 0.8);
    pointLight2.position.set(100,100,100)
    pointLight2.castShadow = true;
    
    original_scene.add(pointLight2)
    original_scene.add(camera);

    // Define functions to be called for progress and on error
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function () { };
    var manager = new LoadingManager();
    manager.addHandler(/\.dds$/i, new DDSLoader());

    // Load model with materials in scene 1
    new MTLLoader(manager)
        .setPath('assets/')
        .load('terrain-2.mtl', function (materials) {
            materials.preload();
            new OBJLoader(manager)
                .setMaterials(materials)
                .setPath('assets/')
                .load('terrain-2.obj', function (object) {
                    // object.position.y = - 50;
                    var scaleFactor = 40
                    object.scale.set(scaleFactor, scaleFactor, scaleFactor);
                    material_scene.add(object);
                }, onProgress, onError);
        });

    // Load model without materials in scene 2
    new OBJLoader(manager)
        .setPath('assets/')
        .load('terrain-2.obj', function (object) {
            // object.position.y = - 50;
            var scaleFactor = 40
            object.scale.set(scaleFactor, scaleFactor, scaleFactor);
            original_scene.add(object);
        }, onProgress, onError);

    // Renderer and controls setup for scene 1
    renderer = new WebGLRenderer({ canvas: canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);
    
    // Renderer and controls setup for scene 2
    renderer2 = new WebGLRenderer({ canvas: canvas2 });
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.setSize(width, height);
    container2.appendChild(renderer2.domElement);
    controls2 = new OrbitControls(camera, renderer2.domElement); // Both have the same camera, but different renderers

    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);

    controls.update()
    renderer.render(material_scene, camera);
    
    controls2.update()
    renderer2.render(original_scene, camera);
}
