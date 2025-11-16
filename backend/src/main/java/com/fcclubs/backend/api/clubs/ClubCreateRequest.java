package com.fcclubs.backend.api.clubs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ClubCreateRequest(
        @NotBlank @Size(min = 3, max = 80) String name,
        @NotBlank @Size(min = 2, max = 10) String shortCode,
        @Size(max = 255) String logoUrl,
        @NotNull Long managerUserId) {
}
