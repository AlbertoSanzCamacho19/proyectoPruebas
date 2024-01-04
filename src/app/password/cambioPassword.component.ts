import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { user } from '../user/user';

@Component({
  selector: 'app-cambioPassword',
  templateUrl: './cambioPassword.component.html',
  styleUrls: ['./cambioPassword.component.css']
})
export class CambioPasswordComponent {

  cambioForm:FormGroup;
  passDiferente: boolean = false;
  usuario:user;

  constructor(private router: Router, private formBuilder:FormBuilder,private userService:UserService){

    this.cambioForm=this.formBuilder.group(
      {
        Pwd1:['',[Validators.required,Validators.minLength(6)]],
        Pwd2:['',[Validators.required,Validators.minLength(6)]]
  
      },)
      this.usuario=new user
      
  }

  volver() {
    window.history.back();
  }

  // Función que te permite mostrar u ocultar la password 1
  passVisible() {
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    const passIcon = document.getElementById("pass-icon") as HTMLImageElement;
  
    if (passwordInput && passIcon) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passIcon.src = "./assets/no_ojo.png";
      } else {
        passwordInput.type = "password";
        passIcon.src = "./assets/ojo.png";
      }
    }
  }

  // Función para cambiar la contraseña
  cambiarPass() {
    if (this.cambioForm.controls['Pwd1'].value === this.cambioForm.controls['Pwd2'].value) {
        this.usuario.datosCambiar(this.cambioForm.controls['Pwd1'].value, this.cambioForm.controls['Pwd2'].value)
        this.userService.cambioPass(this.usuario).subscribe((response) => 
            {
               if (response) {
                    alert('Contraseña actualizada correctamente');
                    this.router.navigate(['Juegos']);
               } else {
                    alert('La contraseña no se ha actualizado...')
               }
            },         
            error=>{
              alert(error)
            }
          )
    } else {
        this.passDiferente = true;
    }
  }

  // Función que te permite mostrar u ocultar la password 2
  passVisible2() {
    const passwordInput = document.getElementById("password2") as HTMLInputElement;
    const passIcon = document.getElementById("pass-icon2") as HTMLImageElement;
  
    if (passwordInput && passIcon) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passIcon.src = "./assets/no_ojo.png";
      } else {
        passwordInput.type = "password";
        passIcon.src = "./assets/ojo.png";
      }
    }
  }
}