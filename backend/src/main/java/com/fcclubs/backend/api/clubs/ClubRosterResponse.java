package com.fcclubs.backend.api.clubs;

import java.util.Comparator;
import java.util.List;

import com.fcclubs.backend.domain.club.Club;

public record ClubRosterResponse(
        Long id,
        String name,
        String shortCode,
        String logoUrl,
        Long managerUserId,
        List<ClubPlayerSummary> players) {

    public static ClubRosterResponse from(Club club) {
        List<ClubPlayerSummary> roster = club.getPlayers().stream()
                .sorted(Comparator.comparing(
                        player -> player.getDisplayName(), String.CASE_INSENSITIVE_ORDER))
                .map(ClubPlayerSummary::from)
                .toList();

        return new ClubRosterResponse(
                club.getId(),
                club.getName(),
                club.getShortCode(),
                club.getLogoUrl(),
                club.getManager() != null ? club.getManager().getId() : null,
                roster);
    }
}
