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
  position? :GeolocationPosition

  constructor(private userService:UserService, private cuatroService:CuatroRService,private socketServie:WSocketService,private tiempoService:TiempoService){
    this.partida=new raya()

  }
  ngOnInit(): void {
    if(this,this.userService.getCurrentUser()==null){
      this.inicioSesion=false
      this.BuscarPartida=false
    }
    navigator.geolocation.getCurrentPosition(
      position=>{
        this.position=position
        console.log(this.position)
      },
      error=>{
        console.log("error al obtener la posicion")
      }
      )
      this.obtenerElTiempo();
      this.obtenerCiudad();
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
        self.ws?.send(JSON.stringify(msg))
      }
      if(data.tipo=="ME VOY"){
        alert("El rival ha abandonado la partida (has ganado)")
        self.rival=""
        self.toca="eres el ganador"
      }
      if(data.tipo=="CONFIRMACION PARTIDA"){
        self.ciuadRival=data.ciudad
        self.tiempoRivaul=data.tiempo
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
        this.partida.celdas[i][col]='R'
        
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








  private obtenerElTiempo(){
    let self=this
    let latitud=this.position?.coords?.latitude
    console.log(latitud)
    let url="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/38.9903762%2C%20-3.9203192?unitGroup=metric&include=current&key=G94RAC9R3W3GNMLK7B9B8Q24B&contentType=json"
    let req=new XMLHttpRequest();

    req.onreadystatechange=function(){
      if(this.readyState==4){
        if(this.status>=200 && this.status<400){
          //todo ok
          console.log("todo ok")
          let response=req.response
          response=JSON.parse(response)
          
           let max=response.days[0].tempmax
          let min=response.days[0].tempmin
          self.tiempo=(max+min)/2
        }
        else{
          console.log("Error de peticion")
        }
      }
    }
    
    req.open("GET",url)
    req.send()
  }

  private obtenerCiudad(){
    let self=this
    let latitud=this.position?.coords?.latitude
    console.log(latitud)
    let url="https://nominatim.openstreetmap.org/reverse?lat=38.9903762&lon=-3.9203192&format=json"
    let req=new XMLHttpRequest();

    req.onreadystatechange=function(){
      if(this.readyState==4){
        if(this.status>=200 && this.status<400){
          //todo ok
          console.log("todo ok")
          let response=req.response
          response=JSON.parse(response)
          
           self.ciudad=response.address.city
        }
        else{
          console.log("Error de peticion")
        }
      }
    }
    
    req.open("GET",url)
    req.send()
  }
  
}


