package com.fcclubs.backend.api.leagues;

import java.time.DayOfWeek;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record LeagueCreateRequest(
        @NotBlank String name,
        @NotBlank String season,
        DayOfWeek defaultMatchDay,
        @NotEmpty @Size(min = 2) List<@NotNull Long> clubIds) {

    public DayOfWeek resolveMatchDay() {
        return defaultMatchDay == null ? DayOfWeek.SUNDAY : defaultMatchDay;
    }
}
