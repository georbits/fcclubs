import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MatchResultService, MatchResultResponse } from './match-result.service';
import { ReportResultPageComponent } from './report-result.page';

describe('ReportResultPageComponent', () => {
  let fixture: ComponentFixture<ReportResultPageComponent>;
  let component: ReportResultPageComponent;
  let service: jasmine.SpyObj<MatchResultService>;

  const response: MatchResultResponse = {
    fixtureId: 42,
    leagueId: 3,
    homeClubId: 10,
    awayClubId: 11,
    kickoffAt: '2024-06-15T18:00:00Z',
    homeScore: 2,
    awayScore: 1,
    status: 'COMPLETED',
  };

  beforeEach(async () => {
    service = jasmine.createSpyObj<MatchResultService>('MatchResultService', ['submitResult']);
    service.submitResult.and.returnValue(of(response));

    await TestBed.configureTestingModule({
      imports: [ReportResultPageComponent, NoopAnimationsModule],
      providers: [{ provide: MatchResultService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('submits a match result when the form is valid', () => {
    component.form.setValue({ fixtureId: 42, homeScore: 3, awayScore: 2 });

    component.submitResult();

    expect(service.submitResult).toHaveBeenCalledWith({ fixtureId: 42, homeScore: 3, awayScore: 2 });
    expect(component.successMessage()).toContain('Result submitted');
  });

  it('shows an error when submission fails', () => {
    service.submitResult.and.returnValue(throwError(() => new Error('fail')));
    component.form.setValue({ fixtureId: 5, homeScore: 1, awayScore: 1 });

    component.submitResult();

    expect(component.errorMessage()).toContain('Could not submit the result');
  });

  it('marks the form invalid when required fields are missing', () => {
    component.form.reset();

    component.submitResult();

    expect(service.submitResult).not.toHaveBeenCalled();
    expect(component.form.invalid).toBeTrue();
  });
});
