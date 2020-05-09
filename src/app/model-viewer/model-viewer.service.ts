import * as THREE from 'three';
import { DDSLoader } from 'three/examples/jsm/loaders/DDSLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModelViewerService implements OnDestroy {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scene: THREE.Scene;
    private light: THREE.AmbientLight;
    private ambientLight: THREE.AmbientLight;
    private pointLight: THREE.PointLight;
    private controls: OrbitControls;

    private cube: THREE.Mesh;

    private frameId: number = null;

    private height: number = window.innerHeight;
    private width: number = window.innerWidth;

    public constructor(private ngZone: NgZone) { }

    public ngOnDestroy(): void {
        if (this.frameId != null) {
            cancelAnimationFrame(this.frameId);
        }
    }

    setDimensions(height: number, width: number): void {
        this.height = height;
        this.width = width;
    }

    public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
        // The first step is to get the reference of the canvas element from our HTML document
        this.canvas = canvas.nativeElement;

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            // alpha: true,    // transparent background
            antialias: true // smooth edges
        });
        this.renderer.setSize(this.width, this.height);

        // create the scene
        this.scene = new THREE.Scene();
        this.ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
        this.pointLight = new THREE.PointLight(0xffffff, 0.8);
        this.pointLight.position.set(100, 100, 100);
        this.pointLight.castShadow = true;
        this.camera = new THREE.PerspectiveCamera(
            45, this.width / this.height, 1, 2000
        );
        this.camera.position.z = 5;
        this.scene.add(this.ambientLight);
        this.scene.add(this.pointLight);
        this.scene.add(this.camera);

        // // soft white light
        // this.light = new THREE.AmbientLight(0x404040);
        // this.light.position.z = 10;
        // this.scene.add(this.light);

        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log(Math.round(percentComplete) + '% downloaded');
            }
        };
        var onError = function () { };

        var manager = new THREE.LoadingManager();
        manager.addHandler(/\.dds$/i, new DDSLoader());
        new MTLLoader(manager)
            .setPath('assets/')
            .load('terrain-2.mtl', (materials) => {
                materials.preload();
                new OBJLoader(manager)
                    .setMaterials(materials)
                    .setPath('assets/')
                    .load('terrain-2.obj', (object) => {
                        // object.position.y = - 50;
                        // var scaleFactor = 10
                        // object.scale.set(scaleFactor, scaleFactor, scaleFactor);
                        this.scene.add(object);
                    }, onProgress, onError);
            });
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // this.cube = new THREE.Mesh(geometry, material);
        // this.scene.add(this.cube);

    }

    public animate(): void {
        // We have to run this outside angular zones,
        // because it could trigger heavy changeDetection cycles.
        this.ngZone.runOutsideAngular(() => {
            if (document.readyState !== 'loading') {
                this.render();
            } else {
                window.addEventListener('DOMContentLoaded', () => {
                    this.render();
                });
            }

            window.addEventListener('resize', () => {
                this.resize();
            });
        });
    }

    public render(): void {
        this.frameId = requestAnimationFrame(() => {
            this.render();
        });

        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;
        this.renderer.render(this.scene, this.camera);
    }

    public resize(): void {
        const width = this.width;
        const height = this.height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }
}
