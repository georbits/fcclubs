import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeagueStandingsResponse } from './league-api.models';

@Injectable({ providedIn: 'root' })
export class LeagueApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = '/api';

  getStandings(leagueId: number): Observable<LeagueStandingsResponse> {
    return this.http.get<LeagueStandingsResponse>(
      `${this.apiBaseUrl}/leagues/${leagueId}/standings`
    );
  }
}
