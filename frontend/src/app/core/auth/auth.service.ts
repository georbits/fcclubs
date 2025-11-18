import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Platform } from '../models/platform';

export interface RegistrationRequest {
  email: string;
  displayName: string;
  password: string;
  platform: Platform;
  platformHandle: string;
}

export interface RegistrationResponse {
  userId: number;
  email: string;
  displayName: string;
  platform: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly authenticated = signal<boolean>(true);
  private readonly apiBaseUrl = '/api';

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  register(request: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiBaseUrl}/auth/register`, request);
  }
}
