import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LeagueApiService } from './league-api.service';
import { LeagueStandingsResponse } from './league-api.models';

describe('LeagueApiService', () => {
  let service: LeagueApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(LeagueApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('fetches standings for the requested league', () => {
    const payload: LeagueStandingsResponse = {
      leagueId: 5,
      leagueName: 'Premier',
      season: '2024',
      table: [],
    };

    service.getStandings(5).subscribe((response) => {
      expect(response).toEqual(payload);
    });

    const request = http.expectOne('/api/leagues/5/standings');
    expect(request.request.method).toBe('GET');
    request.flush(payload);
  });
});
