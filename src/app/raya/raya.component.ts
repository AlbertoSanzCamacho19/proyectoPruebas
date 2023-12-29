import { Component, OnInit } from '@angular/core';
import {raya} from './raya'
import { UserService } from '../user.service';
import { CuatroRService } from '../cuatro-r.service';
import { WSocketService } from '../w-socket.service';
import { user } from '../user/user';
import { TiempoService } from '../tiempo.service';

@Component({
  selector: 'app-raya',
  templateUrl: './raya.component.html',
  styleUrls: ['./raya.component.css']
})
export class RayaComponent implements OnInit{
  partida:raya
  rival:string=""
  esTuTurno:boolean=false
  toca:string=""
  ws?:WebSocket
  url?:string
  enPartida:boolean=false
  BuscarPartida:boolean=true
  inicioSesion=true
  useraux:user=new user()
  usuario:user=new user()
  ciudad:string=""
  tiempo:number=0
  ciuadRival:string=""
  tiempoRivaul:string=""

  constructor(private userService:UserService, private cuatroService:CuatroRService,private socketServie:WSocketService,private tiempoService:TiempoService){
    this.partida=new raya()

  }
  ngOnInit(): void {
    if(this,this.userService.getCurrentUser()==null){
      this.inicioSesion=false
      this.BuscarPartida=false
    }
    this.ciudad=this.tiempoService.obtenerCiudad()
    this.tiempo=this.tiempoService.obtenerElTiempo()
  }
  iniciarSesionInvitado(){
    this.userService.sesion(this.usuario).subscribe(
      result=>{
      this.url=result.body.httpId
      this.BuscarPartida=true
      this.useraux=result.body.user
      },
      error=>{
        console.log(error)
      }
    )
  }

  buscarPartida(){
    if(this.userService.getCurrentUser()!=null){
      this.url=this.socketServie.getCurrentSocket()
      this.useraux.nombre=this.userService.getCurrentUser().nombre
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
            turno : data.body.jugadorTurno.nombre,
            ciudad: this.ciudad,
            tiempo:this.tiempo.toString()
          }
          this.ws?.send(JSON.stringify(msg))
        }
        this.enPartida=true
        this.comporbarTurno(data.body.jugadorTurno.nombre)
        
      },
      (error)=>{
        console.log(error)
      }
    )

    this.ws.onmessage=function(event){
      const data=JSON.parse(event.data)
      if(data.tipo=="INICIO PARTIDA"){
        self.rival=data.remitente
        self.tiempoRivaul=data.tiempo
        self.ciuadRival=data.ciudad
        self.comporbarTurno(data.turno)
        let msg = {
          tipo : "CONFIRMACION PARTIDA",
          destinatario : data.remitente,
          ciudad: self.ciudad,
          tiempo:self.tiempo.toString()
        }
      }
      if(data.tipo=="ME VOY"){
        alert("El rival ha abandonado la partida (has ganado)")
        self.rival=""
        self.toca="eres el ganador"
      }
    }
  }

  cancelarPartida(){
    let msg = {
      tipo : "ME VOY",
      destinatario: this.rival
    }
    this.ws?.send(JSON.stringify(msg))
  }

  comporbarTurno(nombre:string){
    if(nombre==this.useraux.nombre){
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


