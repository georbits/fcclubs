import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClubRosterResponse } from './club-api.models';

@Injectable({ providedIn: 'root' })
export class ClubApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/clubs';

  getRoster(clubId: number): Observable<ClubRosterResponse> {
    return this.http.get<ClubRosterResponse>(`${this.baseUrl}/${clubId}/players`);
  }
}
