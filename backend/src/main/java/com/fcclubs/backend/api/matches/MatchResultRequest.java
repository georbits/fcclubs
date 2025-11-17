package com.fcclubs.backend.api.matches;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MatchResultRequest(
        @NotNull @Min(0) Integer homeScore,
        @NotNull @Min(0) Integer awayScore) {
}
