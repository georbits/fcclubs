package com.fcclubs.backend.api.leagues;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.DayOfWeek;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.club.ClubRepository;
import com.fcclubs.backend.domain.league.Fixture;
import com.fcclubs.backend.domain.league.FixtureRepository;
import com.fcclubs.backend.domain.league.League;
import com.fcclubs.backend.domain.league.LeagueRepository;

@DataJpaTest
@Import(LeagueAdminService.class)
class LeagueAdminServiceTest {

    @Autowired
    private LeagueAdminService leagueAdminService;

    @Autowired
    private ClubRepository clubRepository;

    @Autowired
    private FixtureRepository fixtureRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Test
    void createLeagueLinksClubsAndSchedulesFixtures() {
        Club alpha = saveClub("Alpha", "ALP");
        Club bravo = saveClub("Bravo", "BRV");
        Club charlie = saveClub("Charlie", "CHL");

        LeagueCreateRequest request = new LeagueCreateRequest(
                "Champions League",
                "2024",
                DayOfWeek.SATURDAY,
                List.of(alpha.getId(), bravo.getId(), charlie.getId()));

        LeagueCreationResult result = leagueAdminService.createLeague(request);

        assertThat(result.league().getId()).isNotNull();
        assertThat(result.league().getDefaultMatchDay()).isEqualTo(DayOfWeek.SATURDAY);
        assertThat(result.league().getClubs()).containsExactlyInAnyOrder(alpha, bravo, charlie);
        assertThat(result.fixturesCreated()).isEqualTo(6); // 3 clubs -> 6 fixtures (double round robin)

        List<Fixture> fixtures = fixtureRepository.findByLeagueIdOrderByKickoffAt(result.league().getId());
        assertThat(fixtures).hasSize(6);
        assertThat(fixtures.get(0).getKickoffAt().getDayOfWeek()).isEqualTo(DayOfWeek.SATURDAY);
        assertThat(fixtures.get(2).getKickoffAt()).isAfter(fixtures.get(1).getKickoffAt());
    }

    @Test
    void createLeagueRejectsDuplicateName() {
        League existing = new League();
        existing.setName("Legends");
        existing.setSeason("2024");
        existing.setDefaultMatchDay(DayOfWeek.SUNDAY);
        leagueRepository.save(existing);

        Club alpha = saveClub("Legends Alpha", "LGA");
        Club bravo = saveClub("Legends Bravo", "LGB");

        LeagueCreateRequest request = new LeagueCreateRequest(
                "Legends",
                "2025",
                null,
                List.of(alpha.getId(), bravo.getId()));

        assertThatThrownBy(() -> leagueAdminService.createLeague(request))
                .isInstanceOf(LeagueConflictException.class);
    }

    @Test
    void createLeagueRequiresAtLeastTwoUniqueClubs() {
        Club alpha = saveClub("Solo", "SL0");

        LeagueCreateRequest request = new LeagueCreateRequest(
                "Solo League",
                "2024",
                null,
                List.of(alpha.getId(), alpha.getId()));

        assertThatThrownBy(() -> leagueAdminService.createLeague(request))
                .isInstanceOf(LeagueClubCountException.class);
    }

    @Test
    void createLeagueFailsWhenClubMissing() {
        Club alpha = saveClub("Alpha", "A00");
        Long missingClubId = 999L;

        LeagueCreateRequest request = new LeagueCreateRequest(
                "Mystery League",
                "2024",
                null,
                List.of(alpha.getId(), missingClubId));

        assertThatThrownBy(() -> leagueAdminService.createLeague(request))
                .isInstanceOf(LeagueClubNotFoundException.class);
    }

    private Club saveClub(String name, String shortCode) {
        Club club = new Club();
        club.setName(name);
        club.setShortCode(shortCode);
        return clubRepository.save(club);
    }
}
