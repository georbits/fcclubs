package com.fcclubs.backend.api.profile;

import com.fcclubs.backend.domain.user.GamingPlatform;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProfileUpdateRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(max = 80)
    private String displayName;

    @NotNull
    private GamingPlatform platform;

    @NotBlank
    @Size(max = 60)
    private String platformHandle;

    @Size(max = 255)
    private String profileImageUrl;

    @Size(min = 8, max = 64)
    private String newPassword;

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

    public GamingPlatform getPlatform() {
        return platform;
    }

    public void setPlatform(GamingPlatform platform) {
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

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
