import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { user } from '../user/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm:FormGroup;
  
  usuario:user;

  ws!: WebSocket;
 

  constructor(private formBuilder:FormBuilder,private userService:UserService){
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
    this.ws=new WebSocket("ws://localhost:8080/wsGames?httpId="+result.body.httpId)
    },
 
    error=>{
      alert(error)
    }
  )
  }
}
