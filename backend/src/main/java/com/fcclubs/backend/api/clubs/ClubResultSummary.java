package com.fcclubs.backend.api.clubs;

import java.time.OffsetDateTime;

import com.fcclubs.backend.domain.league.Fixture;
import com.fcclubs.backend.domain.league.FixtureStatus;

public record ClubResultSummary(
        Long fixtureId,
        Long leagueId,
        String leagueName,
        String leagueSeason,
        OffsetDateTime kickoffAt,
        Long homeClubId,
        String homeClubName,
        Long awayClubId,
        String awayClubName,
        Integer homeScore,
        Integer awayScore,
        FixtureStatus status,
        boolean homeClub) {

    public static ClubResultSummary fromFixture(Fixture fixture, Long perspectiveClubId) {
        boolean isHomeClub = fixture.getHomeClub().getId().equals(perspectiveClubId);

        return new ClubResultSummary(
                fixture.getId(),
                fixture.getLeague().getId(),
                fixture.getLeague().getName(),
                fixture.getLeague().getSeason(),
                fixture.getKickoffAt(),
                fixture.getHomeClub().getId(),
                fixture.getHomeClub().getName(),
                fixture.getAwayClub().getId(),
                fixture.getAwayClub().getName(),
                fixture.getHomeScore(),
                fixture.getAwayScore(),
                fixture.getStatus(),
                isHomeClub);
    }
}
