import { Platform } from '../models/platform';

export type UserRole = 'ADMIN' | 'CLUB_MANAGER' | 'PLAYER';

export interface ClubPlayer {
  id: number;
  displayName: string;
  platform: Platform;
  platformHandle: string;
  profileImageUrl: string | null;
  role: UserRole;
}

export interface ClubRosterResponse {
  id: number;
  name: string;
  shortCode: string;
  logoUrl: string | null;
  managerUserId: number | null;
  players: ClubPlayer[];
}

export interface ClubResultSummary {
  fixtureId: number;
  leagueId: number;
  leagueName: string;
  leagueSeason: string;
  kickoffAt: string;
  homeClubId: number;
  homeClubName: string;
  awayClubId: number;
  awayClubName: string;
  homeScore: number;
  awayScore: number;
  status: 'COMPLETED' | 'FORFEITED' | 'SCHEDULED';
  homeClub: boolean;
}

export interface ClubDetailsResponse extends ClubRosterResponse {
  recentResults: ClubResultSummary[];
}
