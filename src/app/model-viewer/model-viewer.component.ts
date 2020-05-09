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

  constructor(private mvServ:ModelViewerService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    // this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 2000);
    // this.addScene(this.objViewer.nativeElement, this.objViewerCanvas.nativeElement, this.camera);
    // this.animate();
    this.mvServ.setDimensions(this.height, this.width);
    this.mvServ.createScene(this.objViewerCanvas,'terrain-2.mtl','terrain-2.obj');
    this.mvServ.animate()
  }

}
