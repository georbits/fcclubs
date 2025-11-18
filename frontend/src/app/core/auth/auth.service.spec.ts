import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService, LoginRequest, LoginResponse, RegistrationRequest, RegistrationResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('returns authentication state based on stored token', () => {
    expect(service.isAuthenticated()).toBeFalse();

    service.setSessionToken('fake-token');
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getAccessToken()).toBe('fake-token');
    expect(localStorage.getItem('fcclubs_access_token')).toBe('fake-token');

    service.clearSession();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('fcclubs_access_token')).toBeNull();
  });

  it('restores an existing token from storage', () => {
    localStorage.setItem('fcclubs_access_token', 'persisted-token');

    const restored = TestBed.inject(AuthService);
    expect(restored.isAuthenticated()).toBeTrue();
    expect(restored.getAccessToken()).toBe('persisted-token');
  });

  it('issues registration requests to the API', () => {
    const request: RegistrationRequest = {
      email: 'new@user.com',
      displayName: 'New User',
      password: 'password123',
      platform: 'EA',
      platformHandle: 'new-handle',
      profileImageUrl: 'https://example.com/avatar.png',
    };

    let response: RegistrationResponse | undefined;
    service.register(request).subscribe((res) => (response = res));

    const mock = httpMock.expectOne('/api/auth/register');
    expect(mock.request.method).toBe('POST');
    mock.flush({
      id: 1,
      email: request.email,
      displayName: request.displayName,
      platform: request.platform,
      platformHandle: request.platformHandle,
      profileImageUrl: request.profileImageUrl,
    });

    expect(response?.id).toBe(1);
  });

  it('sends login requests and returns tokens', () => {
    const request: LoginRequest = {
      email: 'player@example.com',
      password: 'password123',
    };

    let response: LoginResponse | undefined;
    service.login(request).subscribe((res) => (response = res));

    const mock = httpMock.expectOne('/api/auth/login');
    expect(mock.request.method).toBe('POST');
    mock.flush({ accessToken: 'jwt-token', tokenType: 'Bearer', expiresIn: 3600 });

    expect(response?.accessToken).toBe('jwt-token');
  });
});
