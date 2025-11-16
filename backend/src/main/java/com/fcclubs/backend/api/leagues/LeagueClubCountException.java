package com.fcclubs.backend.api.leagues;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
class LeagueClubCountException extends RuntimeException {

    LeagueClubCountException() {
        super("A league requires at least two clubs");
    }
}
