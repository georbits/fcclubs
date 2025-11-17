package com.fcclubs.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.time.DayOfWeek;
import java.util.List;

public class CreateLeagueRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String season;

    private DayOfWeek defaultMatchDay = DayOfWeek.SUNDAY;

    @NotEmpty
    private List<Long> clubIds;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public DayOfWeek getDefaultMatchDay() {
        return defaultMatchDay;
    }

    public void setDefaultMatchDay(DayOfWeek defaultMatchDay) {
        this.defaultMatchDay = defaultMatchDay;
    }

    public List<Long> getClubIds() {
        return clubIds;
    }

    public void setClubIds(List<Long> clubIds) {
        this.clubIds = clubIds;
    }
}
