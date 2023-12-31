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

  esTuTurno:boolean=false
  ws?:WebSocket
  url?:string
  enPartida:boolean=false
  BuscarPartida:boolean=true
  inicioSesion=true
  useraux:user=new user()
  usuario:user=new user()
  latitud ?:number=0
  position!: GeolocationPosition;

  constructor(private userService:UserService, private cuatroService:CuatroRService,private socketServie:WSocketService,private tiempoService:TiempoService){
    this.partida=new raya()
    let self=this
    navigator.geolocation.getCurrentPosition(
      position=>{
        self.position=position
         let latitud=this.position?.coords?.latitude
         let longitud=this.position?.coords?.longitude
         this.obtenerElTiempo(latitud,longitud);
         this.obtenerCiudad(latitud, longitud);
        
      },
      error=>{
        console.log("error al obtener la posicion")
      }
      )

  }
  ngOnInit(): void {
    if(this.userService.getCurrentUser()==null){
      this.inicioSesion=false
      this.BuscarPartida=false
    }
    else{
      this.partida.jugadorNombre=this.userService.getCurrentUser().nombre
    }
    
  }
  iniciarSesionInvitado(){
    this.userService.sesion(this.usuario).subscribe(
      result=>{
      this.url=result.body.httpId
      this.BuscarPartida=true
      this.useraux=result.body.user
      this.partida.jugadorNombre=this.useraux.nombre
      },
      error=>{
        console.log(error)
      }
    )
  }

  buscarPartida(){
    this.partida.celdas=[['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','',''],['','','','','','','']]
    if(this.userService.getCurrentUser()!=null){
      this.url=this.socketServie.getCurrentSocket()
      this.useraux.nombre=this.userService.getCurrentUser().nombre
    }
    
    this.ws=new WebSocket("ws://localhost:8080/wsGames?httpId="+this.url)
    let self=this
      this.cuatroService.empezarPartida4R("Tablero4R").subscribe(
      (data)=>{
        if(data.body.players.length!=2){
          this.partida.rivalNombre="esperando rival"
          this.partida.toca=""
          this.partida.id=data.body.id
        }
        else{
          this.partida.id=data.body.id
          this.partida.rivalNombre=data.body.players[0].nombre
          let msg = {
            tipo : "INICIO PARTIDA",
            destinatario : data.body.players[0].nombre,
            id : data.body.players[0].id,
            turno : data.body.jugadorTurno.nombre,
            ciudad: this.partida.ciudad,
            tiempo:this.partida.tiempo.toString()
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
        self.partida.rivalNombre=data.remitente
        self.partida.tiempoRival=data.tiempo
        self.partida.ciudadRival=data.ciudad
        self.comporbarTurno(data.turno)
        let msg = {
          tipo : "CONFIRMACION PARTIDA",
          destinatario : data.remitente,
          ciudad: self.partida.ciudad,
          tiempo:self.partida.tiempo.toString()
        }
        self.ws?.send(JSON.stringify(msg))
      }
      if(data.tipo=="ME VOY"){
        alert("El rival ha abandonado la partida (has ganado)")
        self.partida.rivalNombre=""
        self.partida.toca="eres el ganador"
      }
      if(data.tipo=="CONFIRMACION PARTIDA"){
        self.partida.ciudadRival=data.ciudad
        self.partida.tiempoRival=data.tiempo
      }
      if(data.tipo=="PONER ACTUALIZACION"){
        self.ponerRival(data.columna)
        self.comporbarTurno(data.turno)
        if(data.ganador==self.partida.rivalNombre){
          alert("hay ganador y no eres tu, loser")
        }
      }
    }
  }
  ponerRival(col:number){
    for(let i=5;i>=0;i--){
      if(this.puedoPoner(i,col)){
        this.partida.celdas[i][col]='A'
        break;
      }
    }
  }

  cancelarPartida(){
    let msg = {
      tipo : "ME VOY",
      destinatario: this.partida.rivalNombre
    }
    this.ws?.send(JSON.stringify(msg))
  }

  comporbarTurno(nombre:string){
    if(nombre==this.useraux.nombre){
      this.esTuTurno=false
      this.partida.toca="Es tu turno"
    }
    else{
      this.esTuTurno=true
      this.partida.toca="Es el turno de "+this.partida.rivalNombre
    }
  }

  ocuparCelda(row:number,col:number){
    for(let i=5;i>=0;i--){
      if(this.puedoPoner(i,col)){
        this.cuatroService.poner(this.partida,col).subscribe(
          (data)=>{
            if (data.body.ganador==this.useraux.nombre){
              alert("eres el ganador")
            }
            this.comporbarTurno(data.body.jugadorTurno.nombre)
            this.partida.celdas[i][col]='R'
            let msg = {
              tipo : "PONER ACTUALIZACION",
              destinatario : this.partida.rivalNombre,
              columna:col,
              ganador:data.body.ganador
            }
            this.ws?.send(JSON.stringify(msg))
          },
          (error)=>{
            console.log(error)
          }
        )
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








  private obtenerElTiempo(latitud: number,longitud:number){
    let self=this
    
    console.log(latitud)
    console.log(longitud)
    let url="https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/"+latitud.toString()+"2%2C%20"+longitud.toString()+"?unitGroup=metric&include=current&key=G94RAC9R3W3GNMLK7B9B8Q24B&contentType=json"
    let req=new XMLHttpRequest();

    req.onreadystatechange=function(){
      if(this.readyState==4){
        if(this.status>=200 && this.status<400){
          //todo ok
          console.log("tempo exito")
          let response=req.response
          response=JSON.parse(response)
          
           let max=response.days[0].tempmax
          let min=response.days[0].tempmin
          self.partida.tiempo=(max+min)/2
        }
        else{
          console.log("Error de peticion")
        }
      }
    }
    
    req.open("GET",url)
    req.send()
  }

  private obtenerCiudad(latitud: number,longitud:number){
    let self=this
    
    let url="https://nominatim.openstreetmap.org/reverse?lat="+latitud.toString()+"&lon="+longitud.toString()+"&format=json"
    let req=new XMLHttpRequest();

    req.onreadystatechange=function(){
      if(this.readyState==4){
        if(this.status>=200 && this.status<400){
          //todo ok
          console.log("ciudad exito")
          let response=req.response
          response=JSON.parse(response)
          
           self.partida.ciudad=response.address.city
           self.partida.ciudad=response.address.town
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


