package com.fcclubs.backend.controller;

import com.fcclubs.backend.domain.User;
import com.fcclubs.backend.dto.ProfileResponse;
import com.fcclubs.backend.dto.RegisterRequest;
import com.fcclubs.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ProfileResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userService.emailExists(request.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setDisplayName(request.getDisplayName());
        user.setPassword(request.getPassword());
        user.setPlatform(request.getPlatform());
        user.setPlatformHandle(request.getPlatformHandle());
        user.setProfileImageUrl(request.getProfileImageUrl());
        User saved = userService.saveNewUser(user);
        return ResponseEntity.ok(userService.toProfile(saved));
    }
}
