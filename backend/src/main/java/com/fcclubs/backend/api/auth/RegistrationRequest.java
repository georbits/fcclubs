package com.fcclubs.backend.api.auth;

import com.fcclubs.backend.domain.user.GamingPlatform;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 3, max = 80) String displayName,
        @NotBlank @Size(min = 8, max = 64) String password,
        @NotNull GamingPlatform platform,
        @NotBlank @Size(min = 2, max = 60) String platformHandle,
        @Size(max = 255) String profileImageUrl) {
}
