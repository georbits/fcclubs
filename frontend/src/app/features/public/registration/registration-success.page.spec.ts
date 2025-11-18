import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RegistrationSuccessPageComponent } from './registration-success.page';

class RouterStub {
  getCurrentNavigation() {
    return { extras: { state: { displayName: 'Tester' } } } as any;
  }
}

describe('RegistrationSuccessPageComponent', () => {
  let fixture: ComponentFixture<RegistrationSuccessPageComponent>;
  let component: RegistrationSuccessPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationSuccessPageComponent],
      providers: [{ provide: Router, useClass: RouterStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationSuccessPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows the display name from navigation state', () => {
    expect(component.displayName()).toBe('Tester');
  });
});
