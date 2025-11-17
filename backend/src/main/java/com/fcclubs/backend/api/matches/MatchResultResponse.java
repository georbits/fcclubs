package com.fcclubs.backend.api.matches;

import java.time.OffsetDateTime;

import com.fcclubs.backend.domain.league.Fixture;
import com.fcclubs.backend.domain.league.FixtureStatus;

public record MatchResultResponse(
        Long fixtureId,
        Long leagueId,
        Long homeClubId,
        Long awayClubId,
        OffsetDateTime kickoffAt,
        Integer homeScore,
        Integer awayScore,
        FixtureStatus status) {

    static MatchResultResponse from(Fixture fixture) {
        return new MatchResultResponse(
                fixture.getId(),
                fixture.getLeague().getId(),
                fixture.getHomeClub().getId(),
                fixture.getAwayClub().getId(),
                fixture.getKickoffAt(),
                fixture.getHomeScore(),
                fixture.getAwayScore(),
                fixture.getStatus());
    }
}
