import THREE, { PerspectiveCamera, Scene, AmbientLight, PointLight, LoadingManager, WebGLRenderer } from 'three';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

var container, canvas;
var container2, canvas2;
var camera, scene, renderer, controls;
var camera2, scene2, renderer2, controls2;
var width, height;


init();
animate();
function init() {
    container = document.getElementById('modelViewer');
    canvas = document.getElementById("modelViewerCanvas");
    container2 = document.getElementById('modelViewer2');
    canvas2 = document.getElementById("modelViewerCanvas2");

    width = 500, height = 500;
    // width = window.innerWidth, height = window.innerHeight;

    camera = new PerspectiveCamera(45, width / height, 1, 2000);
    camera.position.z = 250;
    camera2 = new PerspectiveCamera(45, width / height, 1, 2000);
    camera2.position.z = 250;
    // scene
    scene = new Scene();
    scene2 = new Scene();
    var ambientLight = new AmbientLight(0xcccccc, 0.4);
    var ambientLight2 = new AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    scene2.add(ambientLight2);
    var pointLight = new PointLight(0xffffff, 0.8);
    var pointLight2 = new PointLight(0xffffff, 0.8);
    pointLight.position.set(100,100,100)
    pointLight.castShadow = true;
    pointLight2.position.set(100,100,100)
    pointLight2.castShadow = true;
    // camera.add(pointLight);
    scene.add(camera);
    scene.add(pointLight)
    // camera2.add(pointLight2);
    scene2.add(camera2);
    scene2.add(pointLight2)

    // model
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function () { };
    var manager = new LoadingManager();
    manager.addHandler(/\.dds$/i, new DDSLoader());

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
                    scene.add(object);
                }, onProgress, onError);
        });

    new OBJLoader(manager)
        .setPath('assets/')
        .load('terrain-2.obj', function (object) {
            // object.position.y = - 50;
            var scaleFactor = 40
            object.scale.set(scaleFactor, scaleFactor, scaleFactor);
            scene2.add(object);
        }, onProgress, onError);

    renderer = new WebGLRenderer({ canvas: canvas });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);
    controls = new OrbitControls(camera, renderer.domElement);

    renderer2 = new WebGLRenderer({ canvas: canvas2 });
    renderer2.setPixelRatio(window.devicePixelRatio);
    renderer2.setSize(width, height);
    container2.appendChild(renderer2.domElement);
    controls2 = new OrbitControls(camera, renderer2.domElement);

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
    renderer.render(scene, camera);
    
    controls2.update()
    renderer2.render(scene2, camera);
}
