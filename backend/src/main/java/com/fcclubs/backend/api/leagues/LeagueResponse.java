package com.fcclubs.backend.api.leagues;

import java.time.DayOfWeek;

import com.fcclubs.backend.domain.league.League;

public record LeagueResponse(
        Long id,
        String name,
        String season,
        DayOfWeek defaultMatchDay,
        int clubCount,
        int fixturesScheduled) {

    public static LeagueResponse from(League league, int fixturesScheduled) {
        return new LeagueResponse(
                league.getId(),
                league.getName(),
                league.getSeason(),
                league.getDefaultMatchDay(),
                league.getClubs().size(),
                fixturesScheduled);
    }
}
