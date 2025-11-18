import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ClubRosterResponse } from './club-api.models';
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
});
