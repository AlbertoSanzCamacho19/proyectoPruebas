import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { user } from '../user/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registerForm: FormGroup;

  usuario:user;
  respuestaOK: boolean;
  usuarioExiste: boolean;
  passDiferente: boolean = false;
  flag: boolean = true;

  constructor(private userService:UserService, private formBuilder:FormBuilder, private router: Router){

    this.registerForm = this.formBuilder.group({
      Nombre:['',[Validators.required,Validators.minLength(5)]],
      Email:['',[Validators.required,Validators.email]],
      Pwd1:['',[Validators.required,Validators.minLength(6)]],
      Pwd2:['',[Validators.required,Validators.minLength(6)]],
    });

    this.usuario=new user;
    this.respuestaOK=false;
    this.usuarioExiste=false;
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
  
  onSubmit(){
    console.log(this.registerForm.value)

    if (formValidation(this.registerForm) === true) {
      if (this.registerForm.controls['Pwd1'].value === this.registerForm.controls['Pwd2'].value) {
        this.usuario.datosRegistro(this.registerForm.controls['Nombre'].value,this.registerForm.controls['Email'].value, this.registerForm.controls['Pwd1'].value,this.registerForm.controls['Pwd2'].value);
        this.userService.registrarUsuario(this.usuario).subscribe((response)=>
          {
            if (response === true) {
              this.respuestaOK=true;
              alert("Usuario registrado correctamente")
              this.registerForm.reset();
              this.router.navigate(['Login'])
              this.usuarioExiste=false;
            } else {
              this.respuestaOK=false;
              this.usuarioExiste=true;
            }
          })
      } else {
        this.passDiferente = true;
      }
    }

  // Función que te comprueba si hay algún parámetro vacío del formulario
  function formValidation(form: FormGroup) {
    for (const controlName in form.controls) {
      if (form.controls.hasOwnProperty(controlName)) {
        const control = form.get(controlName);
        if (control && (control.value === null || control.value === '')) {
          return false;
        }
      }
    }
    return true;
  }
}
}
