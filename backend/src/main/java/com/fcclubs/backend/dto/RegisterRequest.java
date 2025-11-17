package com.fcclubs.backend.dto;

import com.fcclubs.backend.domain.Platform;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {
    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String displayName;

    @NotBlank
    private String password;

    @NotNull
    private Platform platform;

    @NotBlank
    private String platformHandle;

    private String profileImageUrl;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Platform getPlatform() {
        return platform;
    }

    public void setPlatform(Platform platform) {
        this.platform = platform;
    }

    public String getPlatformHandle() {
        return platformHandle;
    }

    public void setPlatformHandle(String platformHandle) {
        this.platformHandle = platformHandle;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}
