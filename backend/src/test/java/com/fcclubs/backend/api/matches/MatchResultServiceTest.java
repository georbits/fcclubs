package com.fcclubs.backend.api.matches;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.OffsetDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.club.ClubRepository;
import com.fcclubs.backend.domain.league.Fixture;
import com.fcclubs.backend.domain.league.FixtureRepository;
import com.fcclubs.backend.domain.league.FixtureStatus;
import com.fcclubs.backend.domain.league.League;
import com.fcclubs.backend.domain.league.LeagueRepository;
import com.fcclubs.backend.domain.user.GamingPlatform;
import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserAccountRepository;
import com.fcclubs.backend.domain.user.UserRole;

@DataJpaTest
@Import(MatchResultService.class)
class MatchResultServiceTest {

    @Autowired
    private MatchResultService matchResultService;

    @Autowired
    private FixtureRepository fixtureRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    private UserAccount homeManager;
    private UserAccount awayManager;
    private Fixture fixture;

    @BeforeEach
    void setUp() {
        homeManager = saveUser("home@club.test", UserRole.CLUB_MANAGER);
        awayManager = saveUser("away@club.test", UserRole.CLUB_MANAGER);

        Club homeClub = saveClub("Home", "HOM", homeManager);
        Club awayClub = saveClub("Away", "AWY", awayManager);
        League league = saveLeague("Premier", "2024");
        league.getClubs().add(homeClub);
        league.getClubs().add(awayClub);
        leagueRepository.save(league);

        fixture = new Fixture();
        fixture.setLeague(league);
        fixture.setHomeClub(homeClub);
        fixture.setAwayClub(awayClub);
        fixture.setKickoffAt(OffsetDateTime.now());
        fixtureRepository.save(fixture);
    }

    @Test
    void clubManagerCanSubmitResult() {
        Fixture updated = matchResultService.submitResult(fixture.getId(), 3, 1, homeManager.getEmail());

        assertThat(updated.getStatus()).isEqualTo(FixtureStatus.COMPLETED);
        assertThat(updated.getHomeScore()).isEqualTo(3);
        assertThat(updated.getAwayScore()).isEqualTo(1);
    }

    @Test
    void preventsDuplicateResultSubmissions() {
        matchResultService.submitResult(fixture.getId(), 2, 2, homeManager.getEmail());

        assertThatThrownBy(() -> matchResultService.submitResult(fixture.getId(), 1, 0, homeManager.getEmail()))
                .isInstanceOf(MatchResultConflictException.class)
                .hasMessageContaining("already reported");
    }

    @Test
    void rejectsManagersFromOtherClubs() {
        UserAccount outsider = saveUser("other@club.test", UserRole.CLUB_MANAGER);

        assertThatThrownBy(() -> matchResultService.submitResult(fixture.getId(), 0, 1, outsider.getEmail()))
                .isInstanceOf(MatchPermissionException.class);
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

    private League saveLeague(String name, String season) {
        League league = new League();
        league.setName(name);
        league.setSeason(season);
        league.setUpdatedAt(OffsetDateTime.now());
        return leagueRepository.save(league);
    }
}
