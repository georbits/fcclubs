package com.fcclubs.backend.api.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.fcclubs.backend.domain.user.GamingPlatform;
import com.fcclubs.backend.domain.user.UserAccountRepository;

@DataJpaTest
@Import({RegistrationService.class, RegistrationServiceTest.TestConfig.class})
class RegistrationServiceTest {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void registerPersistsUserWithEncodedPassword() {
        RegistrationRequest request = new RegistrationRequest(
                "player@example.com",
                "Player One",
                "secretpass",
                GamingPlatform.EA,
                "player-one",
                null);

        RegistrationResponse response = registrationService.register(request);

        assertThat(response.id()).isNotNull();
        assertThat(response.email()).isEqualTo("player@example.com");
        assertThat(userAccountRepository.findById(response.id()))
                .get()
                .satisfies(user -> {
                    assertThat(user.getPasswordHash()).isNotEqualTo(request.password());
                    assertThat(user.getPlatform()).isEqualTo(GamingPlatform.EA);
                });
    }

    @Test
    void duplicateEmailThrowsConflict() {
        RegistrationRequest request = new RegistrationRequest(
                "duplicate@example.com",
                "First",
                "password1",
                GamingPlatform.PS5,
                "handle",
                null);

        registrationService.register(request);

        assertThatThrownBy(() -> registrationService.register(request))
                .hasMessageContaining("Email is already registered");
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }
}
