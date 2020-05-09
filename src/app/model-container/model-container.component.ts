import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-model-container',
  templateUrl: './model-container.component.html',
  styleUrls: ['./model-container.component.scss']
})
export class ModelContainerComponent implements OnInit {
  width = 600;
  height = 500;
  camera = new THREE.PerspectiveCamera(
    45, this.width / this.height, 1, 2000
  );

  constructor() { }

  ngOnInit(): void {
    this.camera.position.z = 5;
  }

}
