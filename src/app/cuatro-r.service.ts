import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from './user.service';
import { user } from './user/user';
import { raya } from './raya/raya';
import { ahorcado } from './ahorcado/ahorcado';

@Injectable({
  providedIn: 'root'
})
export class CuatroRService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private client:HttpClient){ }

  empezarPartida4R(juego:any): Observable<any>{

    return this.client.get<any>("http://localhost:8080/matches/start?juego="+juego,{withCredentials:true,observe:"response"})
  }

  poner(raya:raya,col:number): Observable<any>{
    let info={
      id:raya.id,
      tablero: raya.celdas,
      columna:col
    }
    return this.client.post<any>("http://localhost:8080/matches/poner",info,{withCredentials:true,observe:"response"})
  }


  ponerA(tablero:ahorcado,letra:string){
    let info={
      id:tablero.id,
      letra:letra
    }
    return this.client.post<any>("http://localhost:8080/matches/poner",info,{withCredentials:true,observe:"response"})
  }

  resolver(tablero:ahorcado,palabra:string){
    let info={
      id:tablero.id,
      palabra:palabra
    }
    return this.client.post<any>("http://localhost:8080/matches/resolver",info,{withCredentials:true,observe:"response"})
  }
}
