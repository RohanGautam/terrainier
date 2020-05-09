import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
// import { } from 'googlemaps'; // the google maps types
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { BackendCommunicationService } from '../backend-communication.service';
import { InterComponentCommunicationService } from '../inter-component-communication.service';
import { TileCoord } from '../tile-coordinate';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  map: GoogleMap;
  marker : MapMarker;

  mapHeight: number = 400;
  mapWidth: number = 700;
  TILE_SIZE:number=256;
  readonly ROOT_URL = 'http://127.0.0.1:5000'
  scriptAdded: boolean = false; // set to true after evaluating a promise from the service.
  tileCoordinate : TileCoord;

  position: google.maps.LatLng;
  mapOptions: google.maps.MapOptions;
  markerOptions : google.maps.MarkerOptions;

  // injectable (obj initialization done for you, you just use the instance).
  // Remember to put public/pvt so that it's actually initialized.
  constructor(private cdr: ChangeDetectorRef, private gMapServiceObj: BackendCommunicationService, private globalData:InterComponentCommunicationService) { }
  async ngOnInit() {
    this.scriptAdded = await this.gMapServiceObj.initializeGoogleMaps();
    this.setMapOptions();
  }
  
  // called on it's own when '#map' component exists. AFTER map is created with options
  @ViewChild('map',{static:false}) set mapContent (content:GoogleMap){
    if(content!=null){
      this.map = content;
      console.log(`center is ${this.map.getCenter()}`)
    }
  }
  @ViewChild('marker',{static:false}) set markerContent (content:MapMarker){
    if(content!=null){
      this.marker = content;
      console.log(`marker is at ${this.marker.getPosition()}`)
      this.updateMarkerInfo();
      this.cdr.detectChanges();
    }
  }

  setMapOptions(){
    this.position = new google.maps.LatLng(1.334, 103.847);
    this.mapOptions = {
      center: this.position,
      zoom: 10,
      gestureHandling: 'greedy'
    }
    this.markerOptions = {
      draggable:true,
      animation:google.maps.Animation.DROP
    }
  }

  updateMarkerInfo(){
    // update if the map and marker references exist
    if (this.map && this.marker){
      let zoom = this.map.getZoom();
      let point = this.getTileCoord(this.marker.getPosition(), zoom);
      this.tileCoordinate = {
        x: point.x,
        y: point.y,
        zoom: zoom
      }
      this.globalData.updateTileCoord(this.tileCoordinate);
      console.log(`Updated! tc : x ${this.tileCoordinate.x}, y ${this.tileCoordinate.y}, zoom ${zoom}`);
    }    
  }

  getTileCoord(currentLatLng:google.maps.LatLng, zoom:number):google.maps.Point {
    let scale = 1 << zoom;
    let worldCoordinate = this.project(currentLatLng);
    let tileCoordinate = new google.maps.Point(
      Math.floor((worldCoordinate.x * scale) / this.TILE_SIZE),
      Math.floor((worldCoordinate.y * scale) / this.TILE_SIZE)
    );
    return tileCoordinate;
  }
  private project(latLng):google.maps.Point {
    let siny = Math.sin((latLng.lat() * Math.PI) / 180);  
    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);
  
    return new google.maps.Point(
      this.TILE_SIZE * (0.5 + latLng.lng() / 360),
      this.TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI))
    );
  }


}
