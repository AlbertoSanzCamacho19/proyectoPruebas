import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WSocketService {

  constructor() { }

  public getCurrentSocket(): string {
    const url = localStorage.getItem("currentSocket");
    if(url==null){
      return " "
    }
    else{
      return url;
    }
  }
  public setCurrentSocket(ws: string): void {
    localStorage.setItem("currentSocket", ws);
  }
  public deleteCurrentSocket(): void {
    localStorage.removeItem("currentSocket");
  }
}
