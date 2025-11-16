package com.fcclubs.backend.api.profile;

import java.time.OffsetDateTime;

import com.fcclubs.backend.domain.user.GamingPlatform;
import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserRole;

/**
 * Representation of the authenticated user's profile returned to the client.
 */
public record ProfileResponse(
        Long id,
        String email,
        String displayName,
        UserRole role,
        GamingPlatform platform,
        String platformHandle,
        String profileImageUrl,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt) {

    public static ProfileResponse from(UserAccount account) {
        return new ProfileResponse(
                account.getId(),
                account.getEmail(),
                account.getDisplayName(),
                account.getRole(),
                account.getPlatform(),
                account.getPlatformHandle(),
                account.getProfileImageUrl(),
                account.getCreatedAt(),
                account.getUpdatedAt());
    }
}
