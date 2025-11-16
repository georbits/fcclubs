package com.fcclubs.backend.api.clubs;

import jakarta.validation.constraints.NotNull;

public record ClubPlayerRequest(@NotNull Long userId) {
}
