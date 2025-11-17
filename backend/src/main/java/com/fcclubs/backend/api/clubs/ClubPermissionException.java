package com.fcclubs.backend.api.clubs;

class ClubPermissionException extends RuntimeException {

    ClubPermissionException(Long clubId) {
        super("You do not have permission to manage club " + clubId);
    }
}
