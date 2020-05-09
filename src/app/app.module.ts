import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleMapComponent } from './google-map/google-map.component';
import { GoogleMapsModule } from '@angular/google-maps'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import { BackendCommunicationService } from './backend-communication.service';
import { InterComponentCommunicationService } from './inter-component-communication.service';
import { ButtonDeckComponent } from './button-deck/button-deck.component';
import { ModelViewerComponent } from './model-viewer/model-viewer.component';


@NgModule({
  declarations: [
    AppComponent,
    GoogleMapComponent,
    ButtonDeckComponent,
    ModelViewerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleMapsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  providers: [
    BackendCommunicationService,
    InterComponentCommunicationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
