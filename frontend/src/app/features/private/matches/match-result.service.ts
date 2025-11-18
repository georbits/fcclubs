import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MatchResultResponse {
  fixtureId: number;
  leagueId: number;
  homeClubId: number;
  awayClubId: number;
  kickoffAt: string;
  homeScore: number;
  awayScore: number;
  status: string;
}

export interface SubmitMatchResultRequest {
  fixtureId: number;
  homeScore: number;
  awayScore: number;
}

@Injectable({ providedIn: 'root' })
export class MatchResultService {
  private readonly http = inject(HttpClient);

  submitResult(request: SubmitMatchResultRequest): Observable<MatchResultResponse> {
    const { fixtureId, ...body } = request;
    return this.http.post<MatchResultResponse>(`/api/matches/${fixtureId}/result`, body);
  }
}
