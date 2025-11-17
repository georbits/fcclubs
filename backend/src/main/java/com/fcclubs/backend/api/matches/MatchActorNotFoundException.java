package com.fcclubs.backend.api.matches;

class MatchActorNotFoundException extends RuntimeException {

    MatchActorNotFoundException(String email) {
        super("Could not identify acting user: " + email);
    }
}
