import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

// Servicio que controla el campo Chat en el menú
export class SessionService {
  private loggedIn = false;

  setLoggedIn(value: boolean): void {
    this.loggedIn = value;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  logout(): void {
    this.loggedIn = false;
  }
}
