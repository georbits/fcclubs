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
