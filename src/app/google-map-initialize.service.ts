import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GoogleMapInitializeService {

  readonly ROOT_URL = 'http://127.0.0.1:5000'
  mapKey:string;
  mapsUrl:string;

  constructor(private http: HttpClient) {
    // this.initializeGoogleMaps()
  }

  private getGoogleMapsKey(): Observable<string> {
    return this.http.get<string>(this.ROOT_URL + '/getApiKey');
  }

  async initializeGoogleMaps() {
    this.mapKey =  await this.getGoogleMapsKey().toPromise();
    this.mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${this.mapKey}`;
    this.loadMapsAPI();
    await this.delay(2000);
    return true;
  }

  private loadMapsAPI() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    console.log(this.mapsUrl);
    script.src = this.mapsUrl;
    script.defer = true;
  }
  
  private delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

  
  
}
