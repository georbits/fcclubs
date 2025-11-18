package com.fcclubs.backend.api.auth;

public record LoginResponse(String accessToken, String tokenType, long expiresIn) {
}
