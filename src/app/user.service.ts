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
    var result = this.client.post<any>("http://localhost:8080/users/register",info)
    return result;
  }

  login(usuario:any):Observable<any>{
    let info={
      email:usuario.email,
      pwd:usuario.pwd1
    }
    var result = this.client.put<any>("http://localhost:8080/users/login",info,{withCredentials:true,observe:"response"})
    return result;
  }

  cambioPass(usuario:any):Observable<any> {
    let info = {
      pwd1: usuario.pwd1,
      pwd2: usuario.pwd2,
    }
    var result = this.client.put<any>("http://localhost:8080/users/changePassword",info,{withCredentials:true,observe:"response"})
    return result;
  }

  sesion(usuario:any):Observable<any>{
    let info={
      email:usuario.email,
      pwd:usuario.pwd1
    }
    var result = this.client.put<any>("http://localhost:8080/users/sesion",info,{withCredentials:true,observe:"response"})
    return result;
  }

  public getCurrentUser(): user {
    const userJson = localStorage.getItem("currentUser");
    return userJson ? JSON.parse(userJson) : null;
  }

  public setCurrentUser(user: user): void {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
  public deleteCurrentUser(): void {
    localStorage.removeItem("currentUser");
    alert("Usuario deslogueado")
  }
}
