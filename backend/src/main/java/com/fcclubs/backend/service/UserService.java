package com.fcclubs.backend.service;

import com.fcclubs.backend.domain.Role;
import com.fcclubs.backend.domain.User;
import com.fcclubs.backend.dto.ProfileResponse;
import com.fcclubs.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Transactional
    public User saveNewUser(User user) {
        if (user.getRoles().isEmpty()) {
            user.addRole(Role.PLAYER);
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(User user, boolean rotatePassword) {
        if (rotatePassword) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public ProfileResponse toProfile(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setDisplayName(user.getDisplayName());
        response.setPlatform(user.getPlatform());
        response.setPlatformHandle(user.getPlatformHandle());
        response.setProfileImageUrl(user.getProfileImageUrl());
        response.setRoles(user.getRoles());
        return response;
    }
}
