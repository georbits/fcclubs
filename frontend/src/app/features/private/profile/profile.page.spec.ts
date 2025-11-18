import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, Subject, throwError } from 'rxjs';
import { PLATFORM_OPTIONS } from '../../../core/models/platform';
import { ProfilePageComponent } from './profile.page';
import { ProfileResponse, ProfileService, UpdateProfileRequest } from './profile.service';

const profileResponse: ProfileResponse = {
  id: 7,
  email: 'captain@example.com',
  displayName: 'Club Captain',
  role: 'PLAYER',
  platform: PLATFORM_OPTIONS[0].value,
  platformHandle: 'CaptainHandle',
  profileImageUrl: 'https://example.com/avatar.png',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
};

describe('ProfilePageComponent', () => {
  let fixture: ComponentFixture<ProfilePageComponent>;
  let component: ProfilePageComponent;
  let profileService: jasmine.SpyObj<ProfileService>;

  beforeEach(async () => {
    profileService = jasmine.createSpyObj<ProfileService>('ProfileService', ['loadProfile', 'updateProfile']);
    profileService.loadProfile.and.returnValue(of(profileResponse));
    profileService.updateProfile.and.returnValue(of(profileResponse));

    await TestBed.configureTestingModule({
      imports: [ProfilePageComponent, NoopAnimationsModule],
      providers: [{ provide: ProfileService, useValue: profileService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads and populates the profile form on init', () => {
    expect(profileService.loadProfile).toHaveBeenCalled();
    expect(component.form.controls.email.value).toBe(profileResponse.email);
    expect(component.form.controls.platform.value).toBe(profileResponse.platform);
    expect(component.loading()).toBeFalse();
  });

  it('submits profile updates when the form is valid', () => {
    const payload: UpdateProfileRequest = {
      email: 'captain@example.com',
      displayName: 'Updated Captain',
      platform: 'XBOX',
      platformHandle: 'UpdatedHandle',
      profileImageUrl: null,
      newPassword: null,
    };

    component.form.patchValue({
      email: payload.email,
      displayName: payload.displayName,
      platform: payload.platform,
      platformHandle: payload.platformHandle,
      profileImageUrl: payload.profileImageUrl,
      newPassword: '',
      confirmPassword: '',
    });

    component.saveProfile();

    expect(profileService.updateProfile).toHaveBeenCalledWith(payload);
    expect(component.successMessage()).toContain('Profile updated successfully');
  });

  it('surfaces an error when saving fails', () => {
    profileService.updateProfile.and.returnValue(throwError(() => new Error('fail')));
    component.form.patchValue({ displayName: 'Another Name', confirmPassword: '' });

    component.saveProfile();

    expect(component.errorMessage()).toContain('Saving failed');
  });

  it('shows a load error when the profile request fails', () => {
    profileService.loadProfile.and.returnValue(throwError(() => new Error('load failed')));

    const errorFixture = TestBed.createComponent(ProfilePageComponent);
    const errorComponent = errorFixture.componentInstance;
    errorFixture.detectChanges();

    expect(errorComponent.loading()).toBeFalse();
    expect(errorComponent.errorMessage()).toContain('Unable to load your profile');
  });

  it('unsubscribes from the profile load when the component is destroyed', () => {
    const profileSubject = new Subject<ProfileResponse>();
    profileService.loadProfile.and.returnValue(profileSubject.asObservable());

    const teardownFixture = TestBed.createComponent(ProfilePageComponent);
    teardownFixture.detectChanges();

    expect(profileSubject.observers.length).toBeGreaterThan(0);

    teardownFixture.destroy();

    expect(profileSubject.observers.length).toBe(0);
  });
});
