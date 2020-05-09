import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
// import { } from 'googlemaps'; // the google maps types
import { GoogleMapInitializeService } from '../google-map-initialize.service';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  mapHeight: number = 400;
  mapWidth: number = 700;
  readonly ROOT_URL = 'http://127.0.0.1:5000'
  scriptAdded: boolean = false; // set to true after evaluating a promise from the service.

  position: google.maps.LatLng;
  mapOptions: google.maps.MapOptions;
  markerOptions : google.maps.MarkerOptions;

  // injectable (obj initialization done for you, you just use the instance).
  // Remember to put public/pvt so that it's actually initialized.
  constructor(public gMapServiceObj: GoogleMapInitializeService) { }
  async ngOnInit() {
    this.scriptAdded = await this.gMapServiceObj.initializeGoogleMaps();
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


}
