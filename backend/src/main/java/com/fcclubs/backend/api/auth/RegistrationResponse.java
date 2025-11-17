package com.fcclubs.backend.api.auth;

import com.fcclubs.backend.domain.user.GamingPlatform;

public record RegistrationResponse(
        Long id,
        String email,
        String displayName,
        GamingPlatform platform,
        String platformHandle,
        String profileImageUrl) {
}
