package com.fcclubs.backend.api.clubs;

public class ClubManagerNotFoundException extends RuntimeException {

    public ClubManagerNotFoundException(Long managerId) {
        super("Manager not found for id " + managerId);
    }
}
