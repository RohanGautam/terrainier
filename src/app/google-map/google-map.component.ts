import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { GoogleMapsModule } from '@angular/google-maps'
import { } from 'googlemaps';
import { GoogleMapInitializeService } from '../google-map-initialize.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {
  readonly ROOT_URL = 'http://127.0.0.1:5000'
  // mapsUrl: string;
  scriptAdded: boolean = false; // set to true after evaluating a promise from the service.

  // injectable (obj initialization done for you, you just use the instance).
  // Remember to put public/pvt so that it's actually initialized.
  constructor(private http: HttpClient, public gMapServiceObj:GoogleMapInitializeService) {
    // this.getGoogleMapsUrl();
   }
  async ngOnInit() {
    this.scriptAdded = await this.gMapServiceObj.initializeGoogleMaps();
  }


}
