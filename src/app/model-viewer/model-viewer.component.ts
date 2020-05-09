import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Scene, AmbientLight, PointLight, PerspectiveCamera, LoadingManager, WebGLRenderer } from 'three';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ModelViewerService } from './model-viewer.service';


@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss']
})
export class ModelViewerComponent implements OnInit {
  @ViewChild('objViewer') objViewer: ElementRef;
  @ViewChild('objViewerCanvas') objViewerCanvas: ElementRef<HTMLCanvasElement>;

  width = 600;
  height = 500;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera = new PerspectiveCamera(45, this.width / this.height, 1, 2000);
  ambientLight = new AmbientLight(0xcccccc, 0.4);
  pointLight = new PointLight(0xffffff, 0.8);
  controls: OrbitControls;
  scene: Scene = new Scene();

  animate = () => {
    this.controls.update()
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }


  constructor(private mvServ:ModelViewerService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    // this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 2000);
    // this.addScene(this.objViewer.nativeElement, this.objViewerCanvas.nativeElement, this.camera);
    // this.animate();
    this.mvServ.setDimensions(this.height, this.width);
    this.mvServ.createScene(this.objViewerCanvas);
    this.mvServ.animate()
  }



  addScene(viewerDiv, viewerCanvas, camera: PerspectiveCamera) {
    this.pointLight.position.set(100, 100, 100);
    this.pointLight.castShadow = true;
    //add the lights and camera
    this.scene.add(this.ambientLight);
    this.scene.add(this.pointLight)
    this.scene.add(camera);
    // define some callbacks and loaders for the obj loaders
    var onProgress = function (xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete) + '% downloaded');
      }
    };
    var onError = function () { };
    var manager = new LoadingManager();
    manager.addHandler(/\.dds$/i, new DDSLoader());
    // load the models!
    new MTLLoader(manager)
      .setPath('assets/')
      .load('terrain-2.mtl', (materials) => {
        materials.preload();
        new OBJLoader(manager)
          .setMaterials(materials)
          .setPath('assets/')
          .load('terrain-2.obj', (object) => {
            // object.position.y = - 50;
            var scaleFactor = 40
            object.scale.set(scaleFactor, scaleFactor, scaleFactor);
            this.scene.add(object);
          }, onProgress, onError);
      });
    this.renderer = new WebGLRenderer({ canvas: viewerCanvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    viewerDiv.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(camera, this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize, false);
    this.animate();



  }
  onWindowResize() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }





}
