package com.fcclubs.backend.api.clubs;

import com.fcclubs.backend.domain.club.Club;

public record ClubResponse(
        Long id,
        String name,
        String shortCode,
        String logoUrl,
        Long managerUserId) {

    public static ClubResponse from(Club club) {
        return new ClubResponse(
                club.getId(),
                club.getName(),
                club.getShortCode(),
                club.getLogoUrl(),
                club.getManager() != null ? club.getManager().getId() : null);
    }
}
