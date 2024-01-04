import { Component, OnInit } from '@angular/core';
import { ahorcado } from './ahorcado';
import { UserService } from '../user.service';
import { user } from '../user/user';
import { CuatroRService } from '../cuatro-r.service';

@Component({
  selector: 'app-ahorcado',
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})
export class AhorcadoComponent implements OnInit{
  partida:ahorcado;
  inicioSesion=true
  enPartida:boolean=false
  BuscarPartida:boolean=true
  useraux:user=new user()
  usuario:user=new user()
  url?:string
  constructor(private userService:UserService, private cuatroService:CuatroRService){
    this.partida=new ahorcado()
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
    this.cuatroService.empezarPartida4R("Ahorcado","").subscribe(
      (data)=>{ 
        console.log(data)
      },
      (error)=>{
        console.log(error)

      }
    )
  }
  cancelarPartida(){

  }
}
