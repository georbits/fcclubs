package com.fcclubs.backend.api.clubs;

class ClubNotFoundException extends RuntimeException {

    ClubNotFoundException(Long clubId) {
        super("Club not found: " + clubId);
    }
}
