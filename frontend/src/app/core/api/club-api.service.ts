import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClubDetailsResponse, ClubPlayerRequest, ClubRosterResponse } from './club-api.models';

@Injectable({ providedIn: 'root' })
export class ClubApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/clubs';

  getRoster(clubId: number): Observable<ClubRosterResponse> {
    return this.http.get<ClubRosterResponse>(`${this.baseUrl}/${clubId}/players`);
  }

  getDetails(clubId: number): Observable<ClubDetailsResponse> {
    return this.http.get<ClubDetailsResponse>(`${this.baseUrl}/${clubId}`);
  }

  addPlayer(clubId: number, payload: ClubPlayerRequest): Observable<ClubRosterResponse> {
    return this.http.post<ClubRosterResponse>(`${this.baseUrl}/${clubId}/players`, payload);
  }

  removePlayer(clubId: number, playerId: number): Observable<ClubRosterResponse> {
    return this.http.delete<ClubRosterResponse>(`${this.baseUrl}/${clubId}/players/${playerId}`);
  }
}
