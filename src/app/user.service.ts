import { Injectable } from '@angular/core';
import { user } from './user/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private client:HttpClient){ }

  registrarUsuario(usuario:user): Observable<undefined>{
    let info={
      nombre: usuario.nombre,
      email:usuario.email,
      pwd1:usuario.pwd1,
      pwd2:usuario.pwd2
    }
    return this.client.post<any>("http://localhos:8080/user/register",info)
  }
}
