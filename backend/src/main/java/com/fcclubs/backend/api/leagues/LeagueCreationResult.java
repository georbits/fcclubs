package com.fcclubs.backend.api.leagues;

import com.fcclubs.backend.domain.league.League;

public record LeagueCreationResult(League league, int fixturesCreated) {
}
