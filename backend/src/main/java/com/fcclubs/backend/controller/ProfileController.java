package com.fcclubs.backend.controller;

import com.fcclubs.backend.domain.User;
import com.fcclubs.backend.dto.ProfileResponse;
import com.fcclubs.backend.dto.UpdateProfileRequest;
import com.fcclubs.backend.repository.UserRepository;
import com.fcclubs.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {
    private final UserRepository userRepository;
    private final UserService userService;

    public ProfileController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> me(Authentication authentication) {
        return userRepository.findById(subjectAsUserId(authentication))
                .map(userService::toProfile)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> update(Authentication authentication,
                                                  @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = subjectAsUserId(authentication);
        return userRepository.findById(userId)
                .map(user -> {
                    user.setEmail(request.getEmail());
                    user.setDisplayName(request.getDisplayName());
                    user.setPlatform(request.getPlatform());
                    user.setPlatformHandle(request.getPlatformHandle());
                    user.setProfileImageUrl(request.getProfileImageUrl());
                    boolean rotatePassword = false;
                    if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
                        user.setPassword(request.getNewPassword());
                        rotatePassword = true;
                    }
                    User saved = userService.updateUser(user, rotatePassword);
                    return ResponseEntity.ok(userService.toProfile(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Long subjectAsUserId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return Long.parseLong(jwt.getSubject());
    }
}
