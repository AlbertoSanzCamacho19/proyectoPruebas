import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm:FormGroup;
  
 

  constructor(private formBuilder:FormBuilder){
    this.loginForm=this.formBuilder.group(
      {
        Email:['',[Validators.required,Validators.email]],
        Pwd:['',[Validators.required,Validators.minLength(6)]]
  
      },)
  }
  onSubmit(){

  }
}
