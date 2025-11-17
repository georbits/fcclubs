package com.fcclubs.backend.api.profile;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfileResponse getProfile(@AuthenticationPrincipal Jwt jwt) {
        String email = resolveEmail(jwt);
        return ProfileResponse.from(profileService.getProfile(email));
    }

    @PutMapping
    public ProfileResponse updateProfile(
            @AuthenticationPrincipal Jwt jwt, @Valid @RequestBody ProfileUpdateRequest request) {
        String email = resolveEmail(jwt);
        return ProfileResponse.from(profileService.updateProfile(email, request));
    }

    private String resolveEmail(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (StringUtils.hasText(email)) {
            return email;
        }
        return jwt.getSubject();
    }
}
