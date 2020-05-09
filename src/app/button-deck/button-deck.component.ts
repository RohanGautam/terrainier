import { Component, OnInit } from '@angular/core';
import { InterComponentCommunicationService } from '../inter-component-communication.service';
import { TileCoord } from '../tile-coordinate';

@Component({
  selector: 'app-button-deck',
  templateUrl: './button-deck.component.html',
  styleUrls: ['./button-deck.component.scss']
})
export class ButtonDeckComponent implements OnInit {

  currentTileCoord:TileCoord|null;

  constructor(private globalData: InterComponentCommunicationService) { }

  ngOnInit(): void {
    this.globalData.currentTileCoord.subscribe(tileCoord => this.currentTileCoord = tileCoord)
  }

  generateCityModel(){
    if (this.tileCoordExists()) {
      console.log(`Current : x ${this.currentTileCoord.x}, y ${this.currentTileCoord.y}, zoom ${this.currentTileCoord.zoom}`);    
    } 
    else {
      console.log("Tile coordinate is invalid");      
    }
  }

  tileCoordExists(){
    if (this.currentTileCoord!=null){
      if(this.currentTileCoord.zoom>=15){
        return true;
      }
    }
    return false
  }

}
