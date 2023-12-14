import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  constructor(private client : HttpClient) { }


  prepay(matches: number) : Observable<Object> {
    return this.client.get("http://localhost:8080/payments/prepay?matches=" + matches, {
    withCredentials : true,
    observe : "response",
    responseType : "text"
    })
    }
   



  confirm() :Observable<any>{
    return this.client.get<any>("http://localhost:8080/payments/confirm", {
      withCredentials : true,
      observe : "response"
      })
     
  }

  
}
