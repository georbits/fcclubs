package com.fcclubs.backend.api.leagues;

public class LeagueNotFoundException extends RuntimeException {

    public LeagueNotFoundException(Long leagueId) {
        super("League with id %d not found".formatted(leagueId));
    }
}
