package com.fcclubs.backend.api.profile;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
class ProfileNotFoundException extends RuntimeException {

    ProfileNotFoundException(String email) {
        super("No profile found for subject " + email);
    }
}
