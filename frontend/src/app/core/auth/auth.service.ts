import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authenticated = signal<boolean>(true);

  isAuthenticated(): boolean {
    return this.authenticated();
  }
}
