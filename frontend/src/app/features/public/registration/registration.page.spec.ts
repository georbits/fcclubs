import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { AuthService, RegistrationRequest, RegistrationResponse } from '../../../core/auth/auth.service';
import { RegistrationPageComponent } from './registration.page';

const requestPayload: RegistrationRequest = {
  email: 'test@example.com',
  displayName: 'Tester',
  password: 'testpassword',
  platform: 'EA',
  platformHandle: 'TesterHandle',
  profileImageUrl: 'https://example.com/avatar.png',
};

const responsePayload: RegistrationResponse = {
  id: 1,
  email: 'test@example.com',
  displayName: 'Tester',
  platform: 'EA',
  platformHandle: 'TesterHandle',
  profileImageUrl: requestPayload.profileImageUrl,
};

describe('RegistrationPageComponent', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['register']);
    authService.register.and.returnValue(of(responsePayload));

    await TestBed.configureTestingModule({
      imports: [RegistrationPageComponent, NoopAnimationsModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('submits registration when the form is valid', () => {
    component.form.setValue({ ...requestPayload, confirmPassword: requestPayload.password });
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.submit();

    expect(authService.register).toHaveBeenCalledWith(requestPayload);
    expect(navigateSpy).toHaveBeenCalledWith(['/register/success'], {
      state: { displayName: responsePayload.displayName },
    });
  });

  it('shows an error message when registration fails', () => {
    authService.register.and.returnValue(throwError(() => new Error('fail')));
    component.form.setValue({ ...requestPayload, confirmPassword: requestPayload.password });

    component.submit();

    expect(component.errorMessage()).toContain('Registration failed');
  });
});
