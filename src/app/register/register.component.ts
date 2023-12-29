import { Component } from '@angular/core';
import { FormControl, FormGroup,ReactiveFormsModule } from '@angular/forms';
import { user } from '../user/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm=new FormGroup(
    {
      Nombre : new FormControl('',{nonNullable:true}),
      Email:new FormControl('',{nonNullable:true}),
      Pwd1:new FormControl('',{nonNullable:true}),
      Pwd2:new FormControl('',{nonNullable:true})

    }
  );

  usuario:user;
  respuestaOK: boolean;

  constructor(private userService:UserService){
    this.usuario=new user;
    this.respuestaOK=false;
  }

  onSubmit(){
    console.log("Entro")
    console.log(this.registerForm.value)
    this.usuario.datosRegistro(this.registerForm.controls['Nombre'].value,this.registerForm.controls['Email'].value, this.registerForm.controls['Pwd1'].value,this.registerForm.controls['Pwd2'].value);
    this.userService.registrarUsuario(this.usuario).subscribe((data)=>
    {
      console.log(JSON.stringify(data))
    }
  )
  this.respuestaOK=true;
}

bindeo(){
  console.log("hola")
}
}
