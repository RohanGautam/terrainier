import { Component, OnInit, ViewChild, ElementRef, Input, NgZone } from '@angular/core';
import { Scene, AmbientLight, PointLight, PerspectiveCamera, LoadingManager, WebGLRenderer } from 'three';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ModelViewerService } from '../model-viewer.service';


@Component({
  selector: 'app-model-viewer',
  templateUrl: './model-viewer.component.html',
  styleUrls: ['./model-viewer.component.scss']
})
export class ModelViewerComponent implements OnInit {
  @ViewChild('objViewer') objViewer: ElementRef;
  @ViewChild('objViewerCanvas') objViewerCanvas: ElementRef<HTMLCanvasElement>;
  @Input() mtlPath: string;
  @Input() objPath: string;

  width = 600;
  height = 500;

  private mvServ: ModelViewerService;

  constructor(private ngZone: NgZone) {
    this.mvServ = new ModelViewerService(ngZone);
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.mvServ.setDimensions(this.height, this.width);
    // this.mvServ.setCamera(this.camera);
    this.mvServ.createScene(this.objViewerCanvas, this.mtlPath, this.objPath);
    this.mvServ.animate()
  }

}
