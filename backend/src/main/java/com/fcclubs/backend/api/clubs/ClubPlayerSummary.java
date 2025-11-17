package com.fcclubs.backend.api.clubs;

import com.fcclubs.backend.domain.user.GamingPlatform;
import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserRole;

public record ClubPlayerSummary(
        Long id,
        String displayName,
        GamingPlatform platform,
        String platformHandle,
        String profileImageUrl,
        UserRole role) {

    public static ClubPlayerSummary from(UserAccount account) {
        return new ClubPlayerSummary(
                account.getId(),
                account.getDisplayName(),
                account.getPlatform(),
                account.getPlatformHandle(),
                account.getProfileImageUrl(),
                account.getRole());
    }
}
