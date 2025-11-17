package com.fcclubs.backend.api.auth;

import java.time.OffsetDateTime;
import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserAccountRepository;

import org.springframework.http.HttpStatus;

@Service
public class RegistrationService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public RegistrationService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public RegistrationResponse register(RegistrationRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase(Locale.ROOT);
        if (userAccountRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        UserAccount user = new UserAccount();
        user.setEmail(normalizedEmail);
        user.setDisplayName(request.displayName().trim());
        user.setPlatform(request.platform());
        user.setPlatformHandle(request.platformHandle().trim());
        user.setProfileImageUrl(request.profileImageUrl());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setUpdatedAt(OffsetDateTime.now());

        UserAccount saved = userAccountRepository.save(user);
        return new RegistrationResponse(
                saved.getId(),
                saved.getEmail(),
                saved.getDisplayName(),
                saved.getPlatform(),
                saved.getPlatformHandle(),
                saved.getProfileImageUrl());
    }
}
