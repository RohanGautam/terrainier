import THREE, { PerspectiveCamera, Scene, AmbientLight, PointLight, LoadingManager, WebGLRenderer } from 'three';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

var container;
var camera, scene, renderer, controls;

init();
animate();
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);    
    
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 250;
    // scene
    scene = new Scene();
    var ambientLight = new AmbientLight(0xcccccc, 0.4);
    scene.add(ambientLight);
    var pointLight = new PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);

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
    // comment in the following line and import TGALoader if your asset uses TGA textures
    // manager.addHandler( /\.tga$/i, new TGALoader() );
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
                    object.scale.set(scaleFactor,scaleFactor,scaleFactor);
                    scene.add(object);
                }, onProgress, onError);
        });
    //
    renderer = new WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    controls = new OrbitControls( camera, renderer.domElement );
    
    window.addEventListener('resize', onWindowResize, false);
}
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update()
    renderer.render( scene, camera );
}
