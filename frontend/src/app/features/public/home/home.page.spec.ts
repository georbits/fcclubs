import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { LeagueApiService } from '../../../core/api/league-api.service';
import { HomePageComponent } from './home.page';
import { LeagueStandingsResponse } from '../../../core/api/league-api.models';

const sampleStandings: LeagueStandingsResponse = {
  leagueId: 1,
  leagueName: 'Premier',
  season: '2024',
  table: [
    {
      clubId: 10,
      clubName: 'Aurora FC',
      clubShortCode: 'AFC',
      played: 2,
      wins: 2,
      draws: 0,
      losses: 0,
      goalsFor: 6,
      goalsAgainst: 1,
      goalDifference: 5,
      points: 6,
    },
  ],
};

describe('HomePageComponent', () => {
  let fixture: ComponentFixture<HomePageComponent>;
  let component: HomePageComponent;
  let leagueApi: jasmine.SpyObj<LeagueApiService>;

  beforeEach(async () => {
    leagueApi = jasmine.createSpyObj<LeagueApiService>('LeagueApiService', ['getStandings']);
    leagueApi.getStandings.and.returnValue(of(sampleStandings));

    await TestBed.configureTestingModule({
      imports: [HomePageComponent, NoopAnimationsModule],
      providers: [{ provide: LeagueApiService, useValue: leagueApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads standings for the default league on init', () => {
    expect(leagueApi.getStandings).toHaveBeenCalledWith(1);
    expect(component.standings()?.table.length).toBe(1);
  });

  it('refreshes standings with a custom league id', () => {
    leagueApi.getStandings.calls.reset();
    leagueApi.getStandings.and.returnValue(of({ ...sampleStandings, leagueId: 7, leagueName: 'Championship' }));

    component.leagueIdControl.setValue(7);
    component.refreshStandings();

    expect(leagueApi.getStandings).toHaveBeenCalledWith(7);
    expect(component.standings()?.leagueId).toBe(7);
  });
});
