import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { AuthService, RegistrationRequest, RegistrationResponse } from '../../../core/auth/auth.service';
import { RegistrationPageComponent } from './registration.page';

const requestPayload: RegistrationRequest = {
  email: 'test@example.com',
  displayName: 'Tester',
  password: 'testpassword',
  platform: 'EA',
  platformHandle: 'TesterHandle',
};

const responsePayload: RegistrationResponse = {
  userId: 1,
  email: 'test@example.com',
  displayName: 'Tester',
  platform: 'EA',
};

describe('RegistrationPageComponent', () => {
  let fixture: ComponentFixture<RegistrationPageComponent>;
  let component: RegistrationPageComponent;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['register']);
    authService.register.and.returnValue(of(responsePayload));

    await TestBed.configureTestingModule({
      imports: [RegistrationPageComponent, NoopAnimationsModule],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('submits registration when the form is valid', () => {
    component.form.setValue({ ...requestPayload, confirmPassword: requestPayload.password });
    component.submit();

    expect(authService.register).toHaveBeenCalledWith(requestPayload);
    expect(component.successMessage()).toContain('Welcome Tester');
  });

  it('shows an error message when registration fails', () => {
    authService.register.and.returnValue(throwError(() => new Error('fail')));
    component.form.setValue({ ...requestPayload, confirmPassword: requestPayload.password });

    component.submit();

    expect(component.errorMessage()).toContain('Registration failed');
  });
});
