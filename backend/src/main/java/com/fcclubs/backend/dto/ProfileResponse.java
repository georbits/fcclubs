package com.fcclubs.backend.dto;

import com.fcclubs.backend.domain.Platform;
import com.fcclubs.backend.domain.Role;

import java.util.Set;

public class ProfileResponse {
    private Long id;
    private String email;
    private String displayName;
    private Platform platform;
    private String platformHandle;
    private String profileImageUrl;
    private Set<Role> roles;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
}
