import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Platform } from '../models/platform';

export interface RegistrationRequest {
  email: string;
  displayName: string;
  password: string;
  platform: Platform;
  platformHandle: string;
  profileImageUrl?: string | null;
}

export interface RegistrationResponse {
  id: number;
  email: string;
  displayName: string;
  platform: Platform;
  platformHandle: string;
  profileImageUrl?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = '/api';
  private readonly accessToken = signal<string | null>(this.restoreToken());
  private readonly authenticated = computed(() => Boolean(this.accessToken()));

  isAuthenticated(): boolean {
    return this.authenticated();
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }

  setSessionToken(token: string): void {
    this.accessToken.set(token);
    localStorage.setItem('fcclubs_access_token', token);
  }

  clearSession(): void {
    this.accessToken.set(null);
    localStorage.removeItem('fcclubs_access_token');
  }

  register(request: RegistrationRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiBaseUrl}/auth/register`, request);
  }

  private restoreToken(): string | null {
    return localStorage.getItem('fcclubs_access_token');
  }
}
