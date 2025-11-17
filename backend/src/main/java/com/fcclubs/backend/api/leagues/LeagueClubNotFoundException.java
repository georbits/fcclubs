package com.fcclubs.backend.api.leagues;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
class LeagueClubNotFoundException extends RuntimeException {

    LeagueClubNotFoundException() {
        super("One or more clubs could not be found for league creation");
    }
}
