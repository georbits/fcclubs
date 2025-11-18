import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ClubDetailsResponse, ClubRosterResponse } from './club-api.models';
import { ClubApiService } from './club-api.service';

describe('ClubApiService', () => {
  let service: ClubApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ClubApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches the roster for a club', () => {
    const clubId = 7;
    const mockResponse: ClubRosterResponse = {
      id: clubId,
      name: 'Test Club',
      shortCode: 'TST',
      logoUrl: null,
      managerUserId: 3,
      players: [],
    };

    service.getRoster(clubId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const request = httpMock.expectOne(`/api/clubs/${clubId}/players`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });

  it('fetches club details with recent results', () => {
    const clubId = 9;
    const mockResponse: ClubDetailsResponse = {
      id: clubId,
      name: 'Results FC',
      shortCode: 'RFC',
      logoUrl: 'https://example.com/logo.png',
      managerUserId: 2,
      players: [],
      recentResults: [
        {
          fixtureId: 1,
          leagueId: 4,
          leagueName: 'Premier',
          leagueSeason: '2024',
          kickoffAt: '2024-06-01T00:00:00Z',
          homeClubId: clubId,
          homeClubName: 'Results FC',
          awayClubId: 3,
          awayClubName: 'Rivals',
          homeScore: 2,
          awayScore: 1,
          status: 'COMPLETED',
          homeClub: true,
        },
      ],
    };

    service.getDetails(clubId).subscribe((response) => {
      expect(response.recentResults.length).toBe(1);
      expect(response.name).toBe('Results FC');
    });

    const request = httpMock.expectOne(`/api/clubs/${clubId}`);
    expect(request.request.method).toBe('GET');
    request.flush(mockResponse);
  });
});
