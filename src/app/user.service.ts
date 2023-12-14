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
    return this.client.post<any>("http://localhost:8080/users/register",info)
  }

  login(usuario:any):Observable<any>{
    let info={
      email:usuario.email,
      pwd:usuario.pwd1
    }
    return this.client.put<any>("http://localhost:8080/users/login",info,{withCredentials:true,observe:"response"})
  }
}
