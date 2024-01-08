import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { user } from '../user/user';
import { WSocketService } from '../w-socket.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm:FormGroup;

  credencialesIncorrectas: boolean = false;
  
  usuario:user;

  ws!: WebSocket;

  constructor(private router: Router, private formBuilder:FormBuilder,private userService:UserService, private wsService:WSocketService, private sessionService: SessionService){

    this.loginForm=this.formBuilder.group(
      {
        Email:['',[Validators.required,Validators.email]],
        Pwd:['',[Validators.required,Validators.minLength(6)]]
  
      },)
      this.usuario=new user
      
  }
  
  onSubmit(){
    this.usuario.datosLogin(this.loginForm.controls['Email'].value, this.loginForm.controls['Pwd'].value)
    this.userService.login(this.usuario).subscribe(
    result => {

      if (result.body.user !== null && result.body.token !== null) {
        this.wsService.setCurrentSocket(result.body.httpId)
        //const usu=JSON.parse(result.body.user)
        this.userService.setCurrentUser(result.body.user)
        alert("Sesion Iniciada con exito")
        
        // Establecer el estado de la sesión
        this.sessionService.setLoggedIn(true);
        this.router.navigate(['Juegos'])

      } else {
        this.credencialesIncorrectas = true;
        this.loginForm.reset();
      }
    },
 
    error=>{
      alert(error)
    }
  )
  }
}
