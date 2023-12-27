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


document.addEventListener('DOMContentLoaded', function() {
  const menu = document.getElementById('menu-icon');
  const nav = document.getElementById('nav');
  
  if (menu && nav) {
    const navUl = nav.querySelector('ul');

    if (navUl) {
      menu.addEventListener('click', () => {
        if (window.getComputedStyle(navUl).display === 'none') {
          navUl.style.display = 'block';
        } else {
          navUl.style.display = 'none';
        }
      });
    } else {
      console.error('No se encontró la lista del menú');
    }
  } else {
    console.error('No se encontraron el menú o el icono del menú');
  }
});
