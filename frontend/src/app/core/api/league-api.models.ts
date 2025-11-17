export interface LeagueStandingRow {
  clubId: number;
  clubName: string;
  clubShortCode: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface LeagueStandingsResponse {
  leagueId: number;
  leagueName: string;
  season: string;
  table: LeagueStandingRow[];
}
