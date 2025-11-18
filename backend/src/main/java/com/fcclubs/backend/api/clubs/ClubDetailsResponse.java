package com.fcclubs.backend.api.clubs;

import java.util.Comparator;
import java.util.List;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.league.Fixture;

public record ClubDetailsResponse(
        Long id,
        String name,
        String shortCode,
        String logoUrl,
        Long managerUserId,
        List<ClubPlayerSummary> players,
        List<ClubResultSummary> recentResults) {

    public static ClubDetailsResponse from(Club club, List<Fixture> fixtures, Long perspectiveClubId) {
        List<ClubPlayerSummary> roster = club.getPlayers().stream()
                .sorted(Comparator.comparing(player -> player.getDisplayName(), String.CASE_INSENSITIVE_ORDER))
                .map(ClubPlayerSummary::from)
                .toList();

        List<ClubResultSummary> results = fixtures.stream()
                .map(fixture -> ClubResultSummary.fromFixture(fixture, perspectiveClubId))
                .toList();

        return new ClubDetailsResponse(
                club.getId(),
                club.getName(),
                club.getShortCode(),
                club.getLogoUrl(),
                club.getManager() != null ? club.getManager().getId() : null,
                roster,
                results);
    }
}
