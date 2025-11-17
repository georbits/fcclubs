package com.fcclubs.backend.api.leagues;

public record LeagueStandingRow(
        Long clubId,
        String clubName,
        String clubShortCode,
        int played,
        int wins,
        int draws,
        int losses,
        int goalsFor,
        int goalsAgainst,
        int goalDifference,
        int points) {
}
