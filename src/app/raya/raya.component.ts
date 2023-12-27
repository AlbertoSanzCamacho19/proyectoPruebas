import { Component } from '@angular/core';
import {raya} from './raya'
import { UserService } from '../user.service';
import { CuatroRService } from '../cuatro-r.service';

@Component({
  selector: 'app-raya',
  templateUrl: './raya.component.html',
  styleUrls: ['./raya.component.css']
})
export class RayaComponent {
  partida:raya
 

  constructor(private userService:UserService, private cuatroService:CuatroRService){
    this.partida=new raya()

  }

  buscarPartida(){
    document.cookie = "id_user=" + this.userService.getCurrentUser().nombre + "; expires=Thu, 01 Jan 2099 00:00:00 GMT; path=/";
    const headers = { 'Content-Type': 'application/json', 'Cookie': document.cookie };
    this.cuatroService.empezarPartida4R("Tablero4R",headers).subscribe(
      (data)=>{
        console.log(data)
      },
      (error)=>{
        console.log(error)
      }
    )
  }
  

  ocuparCelda(row:number,col:number){
    for(let i=5;i>=0;i--){
      if(this.puedoPoner(i,col)){
        this.partida.celdas[i][col]='X'
        break;
      }
    }
  }

  puedoPoner(row:number,col:number):boolean{

      if (this.partida.celdas[row][col]==''){
        return true
      }
      else{
        return false
      }
  }
  
}


