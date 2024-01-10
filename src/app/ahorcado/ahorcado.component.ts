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
  resolverForm:FormGroup;





  constructor(private userService:UserService, private cuatroService:CuatroRService, private socketService:WSocketService,private formBuilder:FormBuilder){
    this.partida=new ahorcado()
    this.letraForm=this.formBuilder.group(
      {
        Letra:['',[Validators.required,Validators.maxLength(1)]]
  
      },)
    this.resolverForm=this.formBuilder.group(
      {
        Palabra:['',[Validators.required,Validators.maxLength(1)]]
  
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
      this.url=this.socketService.getCurrentSocket()
      this.useraux.nombre=this.userService.getCurrentUser().nombre
    }
    this.partida.vidas=10
    this.partida.vidasRival=10
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
          let aux1=data.body.palabraJugador1
          let letras1=aux1.split('')
          for(let i in letras1)  {
            this.partida.palabraVaciaRival.push("_")
          }


          let aux=data.body.palabraJugador2
          let letras=aux.split('')
          for(let i in letras)  {
            this.partida.palabraVacia.push("_")
            this.partida.palabraJugador.push(letras[i])
          }
          this.comprobarTurno(data.body.jugadorTurno.nombre)
          this.mostrarPalabra('ahorcado-container-rival',this.partida.palabraVaciaRival)
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
        for(let i in self.partida.palabraRival){
          self.partida.palabraVaciaRival.push('_')
        }
        for(let i in self.partida.palabraJugador){
          self.partida.palabraVacia.push('_')
        }

        self.mostrarPalabra('ahorcado-container-rival',self.partida.palabraVaciaRival)
        self.mostrarPalabra('ahorcado-container',self.partida.palabraVacia)
        self.comprobarTurno(data.turno)
      }
      
      if(data.tipo=="PONER ACTUALIZACION"){
        self.comprobarTurno(data.turno)
        let buena=false
        if(data.ganador==self.partida.rivalNombre){
          alert("hay ganador y no eres tu, loser")
          self.enPartida=false
          self.BuscarPartida=true
        }
        else if(data.ganador==self.partida.jugadorNombre){
          alert("Has ganado, el rival se ha quedado sin vidas")
          self.ponerMala('malas-rival',data.letra)
          self.partida.vidasRival=self.partida.vidasRival-1
          self.enPartida=false
          self.BuscarPartida=true
        }
        else{
          for(let i in self.partida.palabraRival){
            if(self.partida.palabraRival[i]==data.letra){
              self.partida.palabraVaciaRival[i]=data.letra
              buena=true
            }
          }
          if(buena){
            self.mostrarPalabra('ahorcado-container-rival',self.partida.palabraVaciaRival)
          }
          else{
            self.ponerMala('malas-rival',data.letra)
            self.partida.vidasRival=self.partida.vidasRival-1
          }
        }
      }
      if(data.tipo=="RESOLVER"){
        self.comprobarTurno(data.turno)
        if(data.ganador==self.partida.rivalNombre){
          self.mostrarPalabra('ahorcado-container-rival',data.palabra)
          alert("hay ganador y no eres tu, loser")
          self.enPartida=false
          self.BuscarPartida=true
        }
        else if(data.ganador==self.partida.jugadorNombre){
          alert("Has ganado, el rival se ha quedado sin vidas")
          self.ponerMala('malas-rival',data.letra)
          self.partida.vidasRival=self.partida.vidasRival-1
          self.enPartida=false
          self.BuscarPartida=true
        }
        else{
            self.ponerMala('malas-rival',data.palabra)
            self.partida.vidasRival=self.partida.vidasRival-1
          }
      }
    }
  }

  ponerMala(elementId:any,word:string){
    const container = document.getElementById(elementId);
    if (container) {
      let letterPiece = document.createElement('div');
      letterPiece.innerHTML = word
      container.appendChild(letterPiece);
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
    const letra=this.letraForm.controls['Letra'].value
    this.cuatroService.ponerA(this.partida,letra).subscribe(
      (data)=>{
        console.log(data)
        if(data.body.ganador==this.partida.rivalNombre){
          alert("has perdido, te has quedado sin vidas")
          this.mostrarPalabra('ahorcado-container',this.partida.palabraJugador)
          this.mostrarPalabra('ahorcado-container-rival',this.partida.palabraRival)
        }
        let buena=false
        for(let i in this.partida.palabraJugador){
          if(this.partida.palabraJugador[i]==letra){
            this.partida.palabraVacia[i]=letra
            buena=true
          }
        }
        if(buena){
          this.mostrarPalabra('ahorcado-container',this.partida.palabraVacia)
        }
        else{
          this.ponerMala('malas',letra)
          this.partida.vidas=this.partida.vidas-1
        }
        
        this.comprobarTurno(data.body.jugadorTurno.nombre)
        let msg = {
          tipo : "PONER ACTUALIZACION",
          destinatario : this.partida.rivalNombre,
          letra:letra,
          turno:data.body.jugadorTurno.nombre,
          ganador:data.body.ganador
        }
        this.ws?.send(JSON.stringify(msg))
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  onSubmit2(){
    const palabra=this.resolverForm.controls['Palabra'].value
    this.cuatroService.resolver(this.partida,palabra).subscribe(
      (data)=>{
        console.log(data)
        if(data.body.ganador==this.partida.jugadorNombre){
          alert("eres el ganador")
          this.mostrarPalabra('ahorcado-container',palabra)
        }
        else if(data.body.ganador==this.partida.rivalNombre){
          alert("has perdido, te has quedado sin vidas")
          this.mostrarPalabra('ahorcado-container',palabra)
          this.mostrarPalabra('ahorcado-container-rival',this.partida.palabraRival)
        }
        else{
          this.ponerMala('malas',palabra)
          this.partida.vidas=this.partida.vidas-1
        }
        let msg = {
          tipo : "RESOLVER",
          destinatario : this.partida.rivalNombre,
          palabra:palabra,
          turno:data.body.jugadorTurno.nombre,
          ganador:data.body.ganador
        }
        this.ws?.send(JSON.stringify(msg))
        this.comprobarTurno(data.body.jugadorTurno.nombre)
      },
      (error)=>{
        console.log(error)
        
      }
    )
  }


  mostrarPalabra(elementId:any,word:string[]){
    const container = document.getElementById(elementId);
    const letras=word
    if (container) {
      const spans = container.getElementsByTagName('span');
    for (let i = spans.length - 1; i >= 0; i--) {
    container.removeChild(spans[i]);
    }
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
