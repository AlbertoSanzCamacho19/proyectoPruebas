import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { WSocketService } from '../w-socket.service';
import { SessionService } from '../session.service';
import { error } from 'jquery';

@Component({
  selector: 'app-borrar-usuario',
  templateUrl: './borrar-usuario.component.html',
  styleUrls: ['./borrar-usuario.component.css']
})
export class BorrarUsuarioComponent {

  constructor(private router: Router, private userService:UserService, private wsService:WSocketService, private sessionService: SessionService) {
  }

  eliminarCuenta() {
    if (this.userService.getCurrentUser() != null) {
        this.userService.borrarUser(this.userService.getCurrentUser()).subscribe((response) => 
          {
            if (response) {
              alert("La cuenta ha sido borrada correctamente");
              this.sessionService.logout()
              this.userService.deleteCurrentUser()
              this.wsService.deleteCurrentSocket()
              this.router.navigate(['Login']);
            } else {
              alert("La cuenta no se ha borrado correctamente...")
            }
          },
          error => {
            alert("Error al borrar la cuenta");
          }
        )
    }
  }

  volver() {
    this.router.navigate(['Juegos']);
  }

}
