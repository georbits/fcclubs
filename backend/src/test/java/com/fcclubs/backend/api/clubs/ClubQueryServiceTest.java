package com.fcclubs.backend.api.clubs;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.OffsetDateTime;

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
@Import(ClubQueryService.class)
class ClubQueryServiceTest {

    @Autowired
    private ClubQueryService clubQueryService;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private FixtureRepository fixtureRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Test
    void returnsRosterAndLatestCompletedResults() {
        var manager = saveUser("manager@example.com", UserRole.CLUB_MANAGER);
        Club homeClub = saveClub("Home Club", "HOM", manager);
        Club awayClub = saveClub("Away Club", "AWY", null);
        League league = saveLeague("Premier", "2024");

        Fixture older = completedFixture(league, homeClub, awayClub, OffsetDateTime.now().minusDays(7), 1, 0);
        Fixture newer = completedFixture(league, awayClub, homeClub, OffsetDateTime.now().minusDays(1), 2, 3);
        scheduledFixture(league, homeClub, awayClub, OffsetDateTime.now().plusDays(2));

        var response = clubQueryService.getClubDetails(homeClub.getId());

        assertThat(response.id()).isEqualTo(homeClub.getId());
        assertThat(response.players()).hasSize(1);
        assertThat(response.recentResults()).hasSize(2);
        assertThat(response.recentResults().get(0).fixtureId()).isEqualTo(newer.getId());
        assertThat(response.recentResults().get(0).homeClub()).isFalse();
        assertThat(response.recentResults().get(1).fixtureId()).isEqualTo(older.getId());
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
        Club club = new Club();
        club.setName(name);
        club.setShortCode(shortCode);
        club.setLogoUrl(null);
        club.setManager(manager);
        if (manager != null) {
            club.getPlayers().add(manager);
        }
        return clubRepository.save(club);
    }

    private League saveLeague(String name, String season) {
        League league = new League();
        league.setName(name);
        league.setSeason(season);
        return leagueRepository.save(league);
    }

    private Fixture completedFixture(League league, Club home, Club away, OffsetDateTime kickoffAt, int homeScore, int awayScore) {
        Fixture fixture = new Fixture();
        fixture.setLeague(league);
        fixture.setHomeClub(home);
        fixture.setAwayClub(away);
        fixture.setKickoffAt(kickoffAt);
        fixture.setHomeScore(homeScore);
        fixture.setAwayScore(awayScore);
        fixture.setStatus(FixtureStatus.COMPLETED);
        return fixtureRepository.save(fixture);
    }

    private Fixture scheduledFixture(League league, Club home, Club away, OffsetDateTime kickoffAt) {
        Fixture fixture = new Fixture();
        fixture.setLeague(league);
        fixture.setHomeClub(home);
        fixture.setAwayClub(away);
        fixture.setKickoffAt(kickoffAt);
        fixture.setStatus(FixtureStatus.SCHEDULED);
        return fixtureRepository.save(fixture);
    }
}
