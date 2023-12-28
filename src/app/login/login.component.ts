import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { user } from '../user/user';
import { MenuComponent } from '../menu/menu.component';
import { WSocketService } from '../w-socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  loginForm:FormGroup;
  
  usuario:user;

  ws!: WebSocket;

  
 

  constructor(private formBuilder:FormBuilder,private userService:UserService, private wsService:WSocketService){

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
    result=>{
    this.wsService.setCurrentSocket(result.body.httpId)
    //const usu=JSON.parse(result.body.user)
    this.userService.setCurrentUser(result.body.user)
    alert("Sesion Iniciada con exito")

    },
 
    error=>{
      alert(error)
    }
  )
  }
}
