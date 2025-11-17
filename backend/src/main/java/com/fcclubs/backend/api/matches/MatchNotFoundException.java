package com.fcclubs.backend.api.matches;

class MatchNotFoundException extends RuntimeException {

    MatchNotFoundException(Long fixtureId) {
        super("Fixture not found: " + fixtureId);
    }
}
