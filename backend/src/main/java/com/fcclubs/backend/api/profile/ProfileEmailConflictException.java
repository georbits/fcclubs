package com.fcclubs.backend.api.profile;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
class ProfileEmailConflictException extends RuntimeException {

    ProfileEmailConflictException(String email) {
        super("Email already in use: " + email);
    }
}
