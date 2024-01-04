import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { WSocketService } from '../w-socket.service';
import { SessionService } from '../session.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent{


constructor(private userService:UserService,private wsService:WSocketService, private sessionService: SessionService){

}

  mostrar=false
  loggin=false

  mostrarBtns() {
    if(this.mostrar){
      this.mostrar=false
    }
    else{
      if (this.userService.getCurrentUser() != null){
        this.loggin=true
      }
      this.mostrar=true
    }
  }

  ocultar(){
    this.mostrar=false
  }

  // Función que te muestra la opción Chat en el menú
  mostrarChat() {
    return this.sessionService.isLoggedIn();
  }

  desloggear() {
    this.ocultar()
    // Para ocultar el Chat cuando el usuario se desloguea.
    this.sessionService.logout()
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
