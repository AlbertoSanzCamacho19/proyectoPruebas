import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { WSocketService } from '../w-socket.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent{


constructor(private userService:UserService,private wsService:WSocketService){

}

  mostrar=false
  loggin=false

  mostrarBotones(){
    if(this.mostrar){
      this.mostrar=false
    }
    else{
      if(this.userService.getCurrentUser()!=null){
        this.loggin=true
      }
      this.mostrar=true
    }
  }
  ocultar(){
    this.mostrar=false
  }

  desloggear() {
    this.ocultar()
    this.userService.deleteCurrentUser()
    this.wsService.deleteCurrentSocket()
    this.loggin=false
    }
}
