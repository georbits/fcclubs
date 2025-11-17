package com.fcclubs.backend.dto;

public class LeagueSummaryResponse {
    private Long id;
    private String name;
    private String season;
    private int registeredClubs;
    private int fixturesScheduled;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public int getRegisteredClubs() {
        return registeredClubs;
    }

    public void setRegisteredClubs(int registeredClubs) {
        this.registeredClubs = registeredClubs;
    }

    public int getFixturesScheduled() {
        return fixturesScheduled;
    }

    public void setFixturesScheduled(int fixturesScheduled) {
        this.fixturesScheduled = fixturesScheduled;
    }
}
