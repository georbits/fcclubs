package com.fcclubs.backend.api.matches;

class MatchPermissionException extends RuntimeException {

    MatchPermissionException(Long fixtureId) {
        super("You are not authorized to update this fixture: " + fixtureId);
    }
}
