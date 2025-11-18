import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ClubApiService } from '../../../core/api/club-api.service';
import { ClubRosterResponse } from '../../../core/api/club-api.models';
import { ClubDetailsPageComponent } from './club-details.page';

describe('ClubDetailsPageComponent', () => {
  let fixture: ComponentFixture<ClubDetailsPageComponent>;
  let component: ClubDetailsPageComponent;
  let clubApi: jasmine.SpyObj<ClubApiService>;

  const roster: ClubRosterResponse = {
    id: 4,
    name: 'Galaxy FC',
    shortCode: 'GFC',
    logoUrl: 'https://example.com/logo.png',
    managerUserId: 99,
    players: [
      {
        id: 99,
        displayName: 'Manager',
        platform: 'PS5',
        platformHandle: 'ManagerHandle',
        profileImageUrl: null,
        role: 'CLUB_MANAGER',
      },
      {
        id: 13,
        displayName: 'Striker',
        platform: 'EA',
        platformHandle: 'StrikerHandle',
        profileImageUrl: null,
        role: 'PLAYER',
      },
    ],
  };

  beforeEach(async () => {
    clubApi = jasmine.createSpyObj<ClubApiService>('ClubApiService', ['getRoster']);
    clubApi.getRoster.and.returnValue(of(roster));

    await TestBed.configureTestingModule({
      imports: [ClubDetailsPageComponent],
      providers: [
        provideAnimations(),
        { provide: ClubApiService, useValue: clubApi },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ clubId: '4' })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClubDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads roster details for the provided club id', () => {
    expect(clubApi.getRoster).toHaveBeenCalledWith(4);
    expect(component.club()?.name).toBe(roster.name);
  });

  it('surfaces an error when the roster lookup fails', () => {
    clubApi.getRoster.and.returnValue(throwError(() => new Error('failure')));

    fixture = TestBed.createComponent(ClubDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.error()).toContain('Unable to load this club');
  });
});
