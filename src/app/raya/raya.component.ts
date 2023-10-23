import { Component } from '@angular/core';
import {raya} from './raya'

@Component({
  selector: 'app-raya',
  templateUrl: './raya.component.html',
  styleUrls: ['./raya.component.css']
})
export class RayaComponent {
  partida:raya
  

  constructor(){
    this.partida=new raya()
  }

  ocuparCelda(row:number,col:number){
    if(this.puedoPoner(row,col)){
      this.partida.celdas[row][col]='X'
    }else{

      
    }
  }

  puedoPoner(row:number,col:number):boolean{
    if(this.partida.celdas[row][col]=='')
      return true
    else
      return false
    
  }
}


