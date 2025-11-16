package com.fcclubs.backend.api.leagues;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
class LeagueConflictException extends RuntimeException {

    LeagueConflictException(String name) {
        super("League name already exists: " + name);
    }
}
