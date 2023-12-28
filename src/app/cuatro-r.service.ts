import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from './user.service';
import { user } from './user/user';

@Injectable({
  providedIn: 'root'
})
export class CuatroRService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private client:HttpClient){ }




  empezarPartida4R(data:any): Observable<any>{
    return this.client.get<any>("http://localhost:8080/matches/start?juego="+data,{withCredentials:true,observe:"response"})
  }
}
