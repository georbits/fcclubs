package com.fcclubs.backend.dto;

public class StandingsRow implements Comparable<StandingsRow> {
    private Long clubId;
    private String clubName;
    private String shortCode;
    private int played;
    private int wins;
    private int draws;
    private int losses;
    private int goalsFor;
    private int goalsAgainst;

    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public String getClubName() {
        return clubName;
    }

    public void setClubName(String clubName) {
        this.clubName = clubName;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public int getPlayed() {
        return played;
    }

    public void setPlayed(int played) {
        this.played = played;
    }

    public int getWins() {
        return wins;
    }

    public void setWins(int wins) {
        this.wins = wins;
    }

    public int getDraws() {
        return draws;
    }

    public void setDraws(int draws) {
        this.draws = draws;
    }

    public int getLosses() {
        return losses;
    }

    public void setLosses(int losses) {
        this.losses = losses;
    }

    public int getGoalsFor() {
        return goalsFor;
    }

    public void setGoalsFor(int goalsFor) {
        this.goalsFor = goalsFor;
    }

    public int getGoalsAgainst() {
        return goalsAgainst;
    }

    public void setGoalsAgainst(int goalsAgainst) {
        this.goalsAgainst = goalsAgainst;
    }

    public int getGoalDifference() {
        return goalsFor - goalsAgainst;
    }

    public int getPoints() {
        return wins * 3 + draws;
    }

    @Override
    public int compareTo(StandingsRow other) {
        int pointCompare = Integer.compare(other.getPoints(), this.getPoints());
        if (pointCompare != 0) {
            return pointCompare;
        }
        int gdCompare = Integer.compare(other.getGoalDifference(), this.getGoalDifference());
        if (gdCompare != 0) {
            return gdCompare;
        }
        int gfCompare = Integer.compare(other.getGoalsFor(), this.getGoalsFor());
        if (gfCompare != 0) {
            return gfCompare;
        }
        return this.getClubName().compareToIgnoreCase(other.getClubName());
    }
}
