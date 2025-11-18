import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRole } from '../../../core/api/club-api.models';
import { Platform } from '../../../core/models/platform';

export interface ProfileResponse {
  id: number;
  email: string;
  displayName: string;
  role: UserRole;
  platform: Platform;
  platformHandle: string;
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  email: string;
  displayName: string;
  platform: Platform;
  platformHandle: string;
  profileImageUrl?: string | null;
  newPassword?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/profile';

  loadProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(this.baseUrl);
  }

  updateProfile(payload: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.put<ProfileResponse>(this.baseUrl, payload);
  }
}
