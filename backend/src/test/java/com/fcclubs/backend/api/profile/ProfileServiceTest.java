package com.fcclubs.backend.api.profile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fcclubs.backend.domain.user.GamingPlatform;
import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserAccountRepository;

@DataJpaTest
@Import({ProfileService.class, ProfileServiceTest.TestConfig.class})
class ProfileServiceTest {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    private UserAccount baselineUser;

    @BeforeEach
    void setup() {
        baselineUser = new UserAccount();
        baselineUser.setEmail("player@example.com");
        baselineUser.setDisplayName("Original Player");
        baselineUser.setPasswordHash("hash");
        baselineUser.setPlatform(GamingPlatform.EA);
        baselineUser.setPlatformHandle("origin-player");
        baselineUser.setProfileImageUrl(null);
        userAccountRepository.save(baselineUser);
    }

    @Test
    void getProfile_returnsPersistedUser() {
        UserAccount profile = profileService.getProfile("player@example.com");

        assertThat(profile.getDisplayName()).isEqualTo("Original Player");
    }

    @Test
    void updateProfile_updatesFieldsAndPassword() {
        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setEmail("player@example.com");
        request.setDisplayName("Updated Name");
        request.setPlatform(GamingPlatform.PS5);
        request.setPlatformHandle("ps-handle");
        request.setProfileImageUrl("https://cdn/images/new.png");
        request.setNewPassword("newpassword123");

        UserAccount updated = profileService.updateProfile("player@example.com", request);

        assertThat(updated.getDisplayName()).isEqualTo("Updated Name");
        assertThat(updated.getPlatform()).isEqualTo(GamingPlatform.PS5);
        assertThat(updated.getPlatformHandle()).isEqualTo("ps-handle");
        assertThat(updated.getProfileImageUrl()).isEqualTo("https://cdn/images/new.png");
        assertThat(updated.getPasswordHash()).isNotEqualTo("hash");
    }

    @Test
    void updateProfile_conflictingEmailThrowsException() {
        UserAccount other = new UserAccount();
        other.setEmail("other@example.com");
        other.setDisplayName("Other");
        other.setPasswordHash("hash");
        other.setPlatform(GamingPlatform.EA);
        other.setPlatformHandle("other-handle");
        userAccountRepository.save(other);

        ProfileUpdateRequest request = new ProfileUpdateRequest();
        request.setEmail("other@example.com");
        request.setDisplayName("Original Player");
        request.setPlatform(GamingPlatform.EA);
        request.setPlatformHandle("origin-player");

        assertThatThrownBy(() -> profileService.updateProfile("player@example.com", request))
                .isInstanceOf(ProfileEmailConflictException.class);
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }
}
