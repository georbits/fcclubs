import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { ClubApiService } from '../../../core/api/club-api.service';
import { ClubRosterResponse } from '../../../core/api/club-api.models';
import { ClubDashboardPageComponent } from './club-dashboard.page';

const rosterResponse: ClubRosterResponse = {
  id: 42,
  name: 'Test Club',
  shortCode: 'TST',
  logoUrl: null,
  managerUserId: 7,
  players: [
    {
      id: 11,
      displayName: 'Player One',
      platform: 'EA',
      platformHandle: 'PlayerOne',
      profileImageUrl: null,
      role: 'CLUB_MANAGER',
    },
  ],
};

describe('ClubDashboardPageComponent', () => {
  let fixture: ComponentFixture<ClubDashboardPageComponent>;
  let component: ClubDashboardPageComponent;
  let clubApi: jasmine.SpyObj<ClubApiService>;

  beforeEach(async () => {
    clubApi = jasmine.createSpyObj<ClubApiService>('ClubApiService', ['getRoster', 'addPlayer', 'removePlayer']);
    clubApi.getRoster.and.returnValue(of(rosterResponse));
    clubApi.addPlayer.and.returnValue(of(rosterResponse));
    clubApi.removePlayer.and.returnValue(of(rosterResponse));

    await TestBed.configureTestingModule({
      imports: [ClubDashboardPageComponent, NoopAnimationsModule],
      providers: [{ provide: ClubApiService, useValue: clubApi }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads roster data for the provided club id', () => {
    component.clubForm.controls.clubId.setValue(42);

    component.loadRoster();

    expect(clubApi.getRoster).toHaveBeenCalledWith(42);
    expect(component.roster()?.id).toBe(42);
  });

  it('adds a player to the loaded roster', () => {
    component.roster.set(rosterResponse);
    component.addPlayerForm.controls.userId.setValue(99);

    component.addPlayer();

    expect(clubApi.addPlayer).toHaveBeenCalledWith(42, { userId: 99 });
    expect(component.addPlayerForm.controls.userId.value).toBeNull();
  });

  it('surfaces add errors when the request fails', () => {
    clubApi.addPlayer.and.returnValue(throwError(() => new Error('fail')));
    component.roster.set(rosterResponse);
    component.addPlayerForm.controls.userId.setValue(99);

    component.addPlayer();

    expect(component.errorMessage()).toContain('Could not add the player');
  });

  it('removes a player from the roster', () => {
    component.roster.set(rosterResponse);
    const player = rosterResponse.players[0];

    component.removePlayer(player);

    expect(clubApi.removePlayer).toHaveBeenCalledWith(42, player.id);
    expect(component.roster()?.players.length).toBeGreaterThan(0);
  });
});
