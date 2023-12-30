import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { mensajes } from '../user/mensajes';
import { user } from '../user/user';
import { UserService } from '../user.service';
import { WSocketService } from '../w-socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{
  nombre?:string
  personaActual?:mensajes
  personas:string[]=[];
  mensajes:string[]=[];
  per:mensajes[]=[];
  url?:string
  nuevoMensaje: string = '';
  usuario=new user()
  ws?:WebSocket

  mensajeForm=new FormGroup(
    {
      mensaje : new FormControl('',{nonNullable:true})
    }
  );
    constructor(private userService:UserService,private socketServie:WSocketService){


      
    }

  ngOnInit(): void {
    if(this.userService.getCurrentUser()!=null){
      this.usuario=this.userService.getCurrentUser()
      this.url=this.socketServie.getCurrentSocket()
      this.ws=new WebSocket("ws://localhost:8080/wsChat?httpId="+this.url)
      let self=this
      this.ws.onmessage=function(event){
        let data=JSON.parse(event.data)
        if(data.tipo=="NUEVO USUARIO"){
          self.personas.push(data.nombre)
          let personaNueva= new mensajes(data.nombre)
          self.per.push(personaNueva)
        }
        if(data.tipo=="BIENVENIDA"){
          let usuarios=data.usuarios
          for(let i=0;i<usuarios.length;i++){
            let personaNueva= new mensajes(data.usuarios[i])
            self.per.push(personaNueva)
          }
        }
        if(data.tipo="MENSAJE PRIVADO"){
          let remitente=data.remitente
          let mensaje = data.texto
          for(let i=0;i<self.per.length;i++){
            if(remitente==self.per[i].getNombre()){
              self.per[i].setMensaje(remitente+": "+mensaje)
              
            }
          }
        }

      }


    }
  }

  onSubmit() {
    this.nuevoMensaje=this.mensajeForm.controls['mensaje'].value
    if (this.nuevoMensaje.trim() !== '') {
      let msg = {
				tipo : "MENSAJE PRIVADO",
				destinatario : this.personaActual?.getNombre(),
				texto : this.nuevoMensaje
			}
      this.ws?.send(JSON.stringify(msg))
      this.personaActual?.setMensaje(this.usuario.nombre+": "+this.nuevoMensaje)
      this.mensajeForm.controls['mensaje'].setValue("")
      this.nuevoMensaje = '';
    }
  }
  chatPersona(j:number){
      this.mensajes=this.per[j].getMensajes()
      this.personaActual=this.per[j]
      this.nombre=this.per[j].getNombre()
  }


}


