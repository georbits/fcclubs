import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationSuccessPageComponent } from './registration-success.page';

describe('RegistrationSuccessPageComponent', () => {
  let fixture: ComponentFixture<RegistrationSuccessPageComponent>;
  let component: RegistrationSuccessPageComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationSuccessPageComponent, RouterTestingModule],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegistrationSuccessPageComponent);
    component = fixture.componentInstance;
  });

  it('greets the user with the display name from navigation state', () => {
    spyOn(router, 'getCurrentNavigation').and.returnValue({
      extras: { state: { displayName: 'Jordan' } },
    } as any);

    fixture.detectChanges();

    const greeting: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(greeting.textContent?.trim()).toContain('Hi Jordan!');
  });

  it('falls back to a generic greeting when navigation state is missing', () => {
    spyOn(router, 'getCurrentNavigation').and.returnValue(null);

    fixture.detectChanges();

    const greeting: HTMLElement = fixture.nativeElement.querySelector('p');
    expect(greeting.textContent?.trim()).toContain('Hi there!');
  });
});
