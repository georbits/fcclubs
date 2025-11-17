package com.fcclubs.backend.api.clubs;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.club.ClubRepository;
import com.fcclubs.backend.domain.user.GamingPlatform;
import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserAccountRepository;
import com.fcclubs.backend.domain.user.UserRole;

@DataJpaTest
@Import(ClubRosterService.class)
class ClubRosterServiceTest {

    @Autowired
    private ClubRosterService clubRosterService;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private ClubRepository clubRepository;

    private UserAccount manager;
    private Club club;

    @BeforeEach
    void setUp() {
        manager = saveUser("manager@club.test", UserRole.CLUB_MANAGER);
        club = saveClub("Rangers", "RNG", manager);
    }

    @Test
    void managerCanAddPlayerToRoster() {
        UserAccount player = saveUser("striker@club.test", UserRole.PLAYER);

        Club updated = clubRosterService.addPlayer(club.getId(), player.getId(), manager.getEmail());

        assertThat(updated.getPlayers()).extracting(UserAccount::getId)
                .contains(player.getId(), manager.getId());
    }

    @Test
    void adminCanRemovePlayerFromRoster() {
        UserAccount admin = saveUser("admin@club.test", UserRole.ADMIN);
        UserAccount winger = saveUser("winger@club.test", UserRole.PLAYER);
        clubRosterService.addPlayer(club.getId(), winger.getId(), manager.getEmail());

        Club updated = clubRosterService.removePlayer(club.getId(), winger.getId(), admin.getEmail());

        assertThat(updated.getPlayers()).extracting(UserAccount::getId).doesNotContain(winger.getId());
    }

    @Test
    void cannotAddDuplicatePlayers() {
        UserAccount player = saveUser("keeper@club.test", UserRole.PLAYER);
        clubRosterService.addPlayer(club.getId(), player.getId(), manager.getEmail());

        assertThatThrownBy(() -> clubRosterService.addPlayer(club.getId(), player.getId(), manager.getEmail()))
                .isInstanceOf(ClubRosterConflictException.class)
                .hasMessageContaining("already registered");
    }

    @Test
    void preventsUnauthorizedManagersFromEditingOtherClubs() {
        UserAccount outsider = saveUser("outsider@club.test", UserRole.CLUB_MANAGER);
        UserAccount recruit = saveUser("recruit@club.test", UserRole.PLAYER);

        assertThatThrownBy(() -> clubRosterService.addPlayer(club.getId(), recruit.getId(), outsider.getEmail()))
                .isInstanceOf(ClubPermissionException.class);
    }

    @Test
    void preventsRemovingClubManager() {
        assertThatThrownBy(() -> clubRosterService.removePlayer(club.getId(), manager.getId(), manager.getEmail()))
                .isInstanceOf(ClubRosterConflictException.class)
                .hasMessageContaining("manager");
    }

    private UserAccount saveUser(String email, UserRole role) {
        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setDisplayName(email);
        user.setPasswordHash("pw");
        user.setPlatform(GamingPlatform.EA);
        user.setPlatformHandle("handle-" + email);
        user.setRole(role);
        return userAccountRepository.save(user);
    }

    private Club saveClub(String name, String shortCode, UserAccount manager) {
        Club entity = new Club();
        entity.setName(name);
        entity.setShortCode(shortCode);
        entity.setManager(manager);
        entity.getPlayers().add(manager);
        return clubRepository.save(entity);
    }
}
