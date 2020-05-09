import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BackendCommunicationService {
  
  readonly ROOT_URL = 'http://127.0.0.1:5000'

  constructor(private http: HttpClient) { }

  private getGoogleMapsKey(): Observable<string> {
    return this.http.get<string>(this.ROOT_URL + '/getApiKey');
  }

  async initializeGoogleMaps() {
    let mapKey : string = await this.getGoogleMapsKey().toPromise();
    let mapsUrl : string = `https://maps.googleapis.com/maps/api/js?key=${mapKey}`;
    this.loadMapsAPI(mapsUrl);
    await this.delay(2000);
    return true;
  }

  private loadMapsAPI(mapsUrl:string) : void {
    var script = document.createElement("script");
    script.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
    console.log(mapsUrl);
    script.src = mapsUrl;
    script.defer = true;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
