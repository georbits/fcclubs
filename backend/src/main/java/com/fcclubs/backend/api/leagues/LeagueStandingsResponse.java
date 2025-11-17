package com.fcclubs.backend.api.leagues;

import java.util.List;

public record LeagueStandingsResponse(
        Long leagueId,
        String leagueName,
        String season,
        List<LeagueStandingRow> table) {
}
