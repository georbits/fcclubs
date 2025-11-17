package com.fcclubs.backend.api.clubs;

class ClubPlayerNotFoundException extends RuntimeException {

    ClubPlayerNotFoundException(Long userId) {
        super("Player not found: " + userId);
    }
}
