import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from './user.service';
import { user } from './user/user';
import { raya } from './raya/raya';

@Injectable({
  providedIn: 'root'
})
export class CuatroRService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private client:HttpClient){ }

  empezarPartida4R(juego:any,palabra:any): Observable<any>{

    return this.client.get<any>("http://localhost:8080/matches/start?juego="+juego+"&palabra="+palabra,{withCredentials:true,observe:"response"})
  }

  poner(raya:raya,col:number): Observable<any>{
    let info={
      id:raya.id,
      tablero: raya.celdas,
      columna:col
    }
    return this.client.post<any>("http://localhost:8080/matches/poner",info,{withCredentials:true,observe:"response"})
  }
}
