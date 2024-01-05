import { Component, OnInit } from '@angular/core';
import { ahorcado } from './ahorcado';
import { UserService } from '../user.service';
import { user } from '../user/user';
import { CuatroRService } from '../cuatro-r.service';
import { WSocketService } from '../w-socket.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit{
  partida:ahorcado;
  ws?:WebSocket
  inicioSesion=true
  enPartida:boolean=false
  BuscarPartida:boolean=true
  useraux:user=new user()
  usuario:user=new user()
  url?:string
  socketServie: any;
  letraForm:FormGroup;





  constructor(private userService:UserService, private cuatroService:CuatroRService, private socketService:WSocketService,private formBuilder:FormBuilder){
    this.partida=new ahorcado()
    this.letraForm=this.formBuilder.group(
      {
        Letra:['',[Validators.required,Validators.maxLength(1)]]
  
      },)
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
      this.inicioSesion=true
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
    
    this.ws=new WebSocket("ws://localhost:8080/wsAhorcado?httpId="+this.url)
    let self=this
    this.cuatroService.empezarPartida4R("Ahorcado").subscribe(
      (data)=>{ 
        console.log(data)
        if(data.body.players.length!=2){
          this.partida.rivalNombre="esperando rival"
          this.partida.toca=false
          this.partida.id=data.body.id
        }
        else{
          this.partida.id=data.body.id
          this.partida.rivalNombre=data.body.players[0].nombre
          this.partida.palabraRival=data.body.palabraJugador1
          this.partida.palabraJugador=data.body.palabraJugador2
          const letras=this.partida.palabraJugador.split('')
          for(const i in letras)  {
            this.partida.palabraVacia=this.partida.palabraVacia+"_ "
          }
          this.comprobarTurno(data.body.jugadorTurno.nombre)
          this.mostrarPalabra('ahorcado-container-rival',data.body.palabraJugador1)
          this.mostrarPalabra('ahorcado-container',this.partida.palabraVacia)
          let msg = {
            tipo : "INICIO PARTIDA",
            destinatario : data.body.players[0].nombre,
            id : data.body.players[0].id,
            turno : data.body.jugadorTurno.nombre,
            palabraJugador1:data.body.palabraJugador1,
            palabraJugador2:data.body.palabraJugador2
          }
          this.ws?.send(JSON.stringify(msg))

        }
      },
      (error)=>{
        console.log(error)

      }
    )

    this.ws.onmessage=function(event){
      const data=JSON.parse(event.data)
      if(data.tipo=="INICIO PARTIDA"){
        self.partida.rivalNombre=data.remitente
        self.partida.palabraJugador=data.palabraJugador1
        self.partida.palabraRival=data.palabraJugador2
        const letras=self.partida.palabraJugador.split('')
        for(const i in letras)  {
          self.partida.palabraVacia=self.partida.palabraVacia+"_ "
        }
        self.mostrarPalabra('ahorcado-container-rival',self.partida.palabraRival)
        self.mostrarPalabra('ahorcado-container',self.partida.palabraVacia)
        self.comprobarTurno(data.turno)
      }

    }
  }
  
  comprobarTurno(turno:string){
    if(turno==this.partida.jugadorNombre){
      this.partida.toca=true
    }
    else{
      this.partida.toca=false
    }
  }

  onSubmit(){
    this.cuatroService.ponerA(this.partida,this.letraForm.controls['Letra'].value).subscribe(
      (data)=>{
        console.log(data)
      },
      (error)=>{
        console.log(error)

      }
    )
  }



  mostrarPalabra(elementId:any,word:string){
    const container = document.getElementById(elementId);
    const letras=word.split('')
    if (container) {
    for(const i in letras)  {
      let letterPiece = document.createElement('span');
      letterPiece.innerHTML = letras[i]
      container.appendChild(letterPiece);
    }
  }
  }

  cancelarPartida(){

  }
}
