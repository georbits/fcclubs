package com.fcclubs.backend.dto;

import jakarta.validation.constraints.NotNull;

public class AddPlayerRequest {
    @NotNull
    private Long userId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
