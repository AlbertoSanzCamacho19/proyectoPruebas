import { Component } from '@angular/core';
import {raya} from './raya'
import { UserService } from '../user.service';
import { CuatroRService } from '../cuatro-r.service';
import { WSocketService } from '../w-socket.service';

@Component({
  selector: 'app-raya',
  templateUrl: './raya.component.html',
  styleUrls: ['./raya.component.css']
})
export class RayaComponent {
  partida:raya
  rival:string=""
  esTuTurno:boolean=false
  toca:string=""
  ws?:WebSocket
  url?:string
  enPartida:boolean=false

  constructor(private userService:UserService, private cuatroService:CuatroRService,private socketServie:WSocketService){
    this.partida=new raya()

  }

  buscarPartida(){
    if(this.userService.getCurrentUser()==null){
      this.userService.sesion().subscribe(
        result=>{
        this.url=result.httpId
        },
        error=>{
          console.log(error)
        }
      )
    }
    else{
      this.url=this.socketServie.getCurrentSocket()
    }
    this.ws=new WebSocket("ws://localhost:8080/wsGames?httpId="+this.url)
    let self=this
      this.cuatroService.empezarPartida4R("Tablero4R").subscribe(
      (data)=>{
        if(data.body.players.length!=2){
          this.rival="esperando rival"
          this.toca=""
        }
        else{
          this.rival=data.body.players[0].nombre
          let msg = {
            tipo : "INICIO PARTIDA",
            destinatario : data.body.players[0].nombre,
            id : data.body.players[0].id,
            turno : data.body.jugadorTurno.nombre
          }
          this.ws?.send(JSON.stringify(msg))
        }
        this.comporbarTurno(data.body.jugadorTurno.nombre)
        this.enPartida=true
      },
      (error)=>{
        console.log(error)
      }
    )

    this.ws.onmessage=function(event){
      let data=JSON.parse(event.data)
      if(data.tipo=="INICIO PARTIDA"){
        self.rival=data.remitente
        self.comporbarTurno(data.turno)
      }
      if(data.tipo="ME VOY"){
        alert("El rival ha abandonado la partida (has ganado")
        self.rival=""
        self.toca="eres el ganador"
      }
    }
  }

  /*/cancelarPartida(){
    let msg = {
      tipo : "ME VOY"
    }
    this.ws?.send(JSON.stringify(msg))
  }/*/

  comporbarTurno(nombre:string){
    if(nombre==this.userService.getCurrentUser().nombre){
      this.esTuTurno=false
      this.toca="Es tu turno"
    }
    else{
      this.esTuTurno=true
      this.toca="Es el turno de "+this.rival
    }
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


