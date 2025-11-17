package com.fcclubs.backend.api.profile;

import java.time.OffsetDateTime;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserAccountRepository;

@Service
public class ProfileService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserAccount getProfile(String email) {
        return userAccountRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ProfileNotFoundException(email));
    }

    @Transactional
    public UserAccount updateProfile(String email, ProfileUpdateRequest request) {
        UserAccount account = getProfile(email);

        if (!account.getEmail().equalsIgnoreCase(request.getEmail())) {
            ensureEmailAvailable(request.getEmail());
            account.setEmail(request.getEmail());
        }

        account.setDisplayName(request.getDisplayName());
        account.setPlatform(request.getPlatform());
        account.setPlatformHandle(request.getPlatformHandle());
        account.setProfileImageUrl(request.getProfileImageUrl());

        if (StringUtils.hasText(request.getNewPassword())) {
            account.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        account.setUpdatedAt(OffsetDateTime.now());
        return userAccountRepository.save(account);
    }

    private void ensureEmailAvailable(String email) {
        if (userAccountRepository.existsByEmailIgnoreCase(email)) {
            throw new ProfileEmailConflictException(email);
        }
    }
}
