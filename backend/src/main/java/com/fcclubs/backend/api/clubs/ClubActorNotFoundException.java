package com.fcclubs.backend.api.clubs;

class ClubActorNotFoundException extends RuntimeException {

    ClubActorNotFoundException(String email) {
        super("Authenticated user not found: " + email);
    }
}
