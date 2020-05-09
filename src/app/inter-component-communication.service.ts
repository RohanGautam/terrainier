import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { TileCoord } from './tile-coordinate';
@Injectable({
  providedIn: 'root'
})
export class InterComponentCommunicationService {
  private messageSource = new BehaviorSubject<TileCoord|null>(null);
  currentTileCoord = this.messageSource.asObservable()

  constructor() { }

  updateTileCoord(tileCoord : TileCoord){
    this.messageSource.next(tileCoord);
  }
}
