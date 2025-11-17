package com.fcclubs.backend.api.clubs;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.user.GamingPlatform;
import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserAccountRepository;
import com.fcclubs.backend.domain.user.UserRole;

@DataJpaTest
@Import(ClubAdminService.class)
class ClubAdminServiceTest {

    @Autowired
    private ClubAdminService clubAdminService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void createClubPromotesManagerAndPersistsClub() {
        UserAccount manager = saveUser("boss@club.test");

        ClubCreateRequest request = new ClubCreateRequest("Galaxy FC", "gal", null, manager.getId());

        Club club = clubAdminService.createClub(request);

        assertThat(club.getId()).isNotNull();
        assertThat(club.getShortCode()).isEqualTo("GAL");
        assertThat(club.getManager().getId()).isEqualTo(manager.getId());
        assertThat(club.getPlayers()).contains(manager);
        assertThat(club.getManager().getRole()).isEqualTo(UserRole.CLUB_MANAGER);
    }

    @Test
    void createClubFailsWhenNameExists() {
        UserAccount manager = saveUser("alpha@club.test");
        clubAdminService.createClub(new ClubCreateRequest("Alpha", "ALP", null, manager.getId()));

        UserAccount secondManager = saveUser("beta@club.test");

        assertThatThrownBy(() -> clubAdminService.createClub(
                new ClubCreateRequest("Alpha", "BET", null, secondManager.getId())))
                .isInstanceOf(ClubConflictException.class)
                .hasMessageContaining("name");
    }

    @Test
    void createClubFailsWhenShortCodeExists() {
        UserAccount manager = saveUser("primary@club.test");
        clubAdminService.createClub(new ClubCreateRequest("Primary", "PRM", null, manager.getId()));

        UserAccount secondManager = saveUser("secondary@club.test");

        assertThatThrownBy(() -> clubAdminService.createClub(
                new ClubCreateRequest("Secondary", "PRM", null, secondManager.getId())))
                .isInstanceOf(ClubConflictException.class)
                .hasMessageContaining("short code");
    }

    @Test
    void createClubFailsWhenManagerMissing() {
        assertThatThrownBy(() -> clubAdminService.createClub(
                new ClubCreateRequest("Ghosts", "GST", null, 999L)))
                .isInstanceOf(ClubManagerNotFoundException.class);
    }

    private UserAccount saveUser(String email) {
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setDisplayName(email);
        user.setPasswordHash("pw");
        user.setPlatform(GamingPlatform.EA);
        user.setPlatformHandle("handle" + email);
        user.setRole(UserRole.PLAYER);
        return userAccountRepository.save(user);
    }
}
