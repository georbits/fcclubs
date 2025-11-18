import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ProfileResponse, ProfileService, UpdateProfileRequest } from './profile.service';

const mockProfile: ProfileResponse = {
  id: 42,
  email: 'user@example.com',
  displayName: 'Example User',
  role: 'PLAYER',
  platform: 'EA',
  platformHandle: 'ExampleHandle',
  profileImageUrl: null,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

describe('ProfileService', () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests the current profile', () => {
    let response: ProfileResponse | undefined;

    service.loadProfile().subscribe((res) => (response = res));

    const req = httpMock.expectOne('/api/profile');
    expect(req.request.method).toBe('GET');

    req.flush(mockProfile);

    expect(response).toEqual(mockProfile);
  });

  it('submits updated profile details', () => {
    const payload: UpdateProfileRequest = {
      email: 'updated@example.com',
      displayName: 'Updated User',
      platform: 'PS5',
      platformHandle: 'UpdatedHandle',
      profileImageUrl: 'https://example.com/avatar.png',
      newPassword: 'password123',
    };

    let response: ProfileResponse | undefined;

    service.updateProfile(payload).subscribe((res) => (response = res));

    const req = httpMock.expectOne('/api/profile');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush({ ...mockProfile, ...payload, updatedAt: '2024-01-03T00:00:00Z' });

    expect(response?.email).toBe(payload.email);
    expect(response?.platform).toBe(payload.platform);
    expect(response?.updatedAt).toBe('2024-01-03T00:00:00Z');
  });
});
