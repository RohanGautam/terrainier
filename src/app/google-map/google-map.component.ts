import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss']
})
export class GoogleMapComponent implements OnInit {

  readonly ROOT_URL = 'http://127.0.0.1:5000'
  mapsKeyObservable: Observable<string>;
  mapsUrl: string;

  // injectable (obj initialization done for you, you just use the instance)
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getGoogleMapsUrl();
  }  

  loadMapsAPI() {
    (<any>window).googleMapsReady = this.initMap.bind(this);
    (<any>window).initMap = this.initMap;
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    console.log(this.mapsUrl);
    script.src = this.mapsUrl;
    script.defer = true;
  }

  getGoogleMapsKey(): Observable<string> {
    return this.http.get<string>(this.ROOT_URL + '/getApiKey');
  }

  getGoogleMapsUrl() {
    this.getGoogleMapsKey().subscribe((key: string) => {
      this.mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`
      this.loadMapsAPI()
    })
  }

  async initMap() {
    console.log('initMap called');
  }

}
