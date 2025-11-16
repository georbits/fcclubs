package com.fcclubs.backend.api.leagues;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.club.ClubRepository;
import com.fcclubs.backend.domain.league.Fixture;
import com.fcclubs.backend.domain.league.FixtureRepository;
import com.fcclubs.backend.domain.league.League;
import com.fcclubs.backend.domain.league.LeagueRepository;

@Service
public class LeagueAdminService {

    private static final int MATCHES_PER_DAY = 2;
    private static final int HOURS_BETWEEN_MATCHES = 2;
    private static final LocalTime FIRST_KICKOFF = LocalTime.of(18, 0);

    private final LeagueRepository leagueRepository;
    private final FixtureRepository fixtureRepository;
    private final ClubRepository clubRepository;

    public LeagueAdminService(LeagueRepository leagueRepository,
            FixtureRepository fixtureRepository,
            ClubRepository clubRepository) {
        this.leagueRepository = leagueRepository;
        this.fixtureRepository = fixtureRepository;
        this.clubRepository = clubRepository;
    }

    @Transactional
    public LeagueCreationResult createLeague(LeagueCreateRequest request) {
        ensureNameAvailable(request.name());

        List<Long> requestedClubIds = deduplicateClubIds(request.clubIds());
        if (requestedClubIds.size() < 2) {
            throw new LeagueClubCountException();
        }

        List<Club> clubs = loadClubs(requestedClubIds);
        if (clubs.size() != requestedClubIds.size()) {
            throw new LeagueClubNotFoundException();
        }

        League league = new League();
        league.setName(request.name());
        league.setSeason(request.season());
        league.setDefaultMatchDay(request.resolveMatchDay());
        league.getClubs().addAll(clubs);
        league.setUpdatedAt(OffsetDateTime.now());

        League saved = leagueRepository.save(league);
        List<Fixture> fixtures = generateFixtures(saved, clubs);
        fixtureRepository.saveAll(fixtures);

        return new LeagueCreationResult(saved, fixtures.size());
    }

    private List<Long> deduplicateClubIds(List<Long> clubIds) {
        Set<Long> orderedIds = new LinkedHashSet<>(clubIds);
        return new ArrayList<>(orderedIds);
    }

    private List<Club> loadClubs(List<Long> clubIds) {
        Map<Long, Club> clubsById = clubRepository.findAllById(clubIds).stream()
                .collect(Collectors.toMap(Club::getId, Function.identity()));
        return clubIds.stream()
                .map(clubsById::get)
                .filter(club -> club != null)
                .collect(Collectors.toList());
    }

    private void ensureNameAvailable(String name) {
        if (leagueRepository.existsByNameIgnoreCase(name)) {
            throw new LeagueConflictException(name);
        }
    }

    private List<Fixture> generateFixtures(League league, List<Club> clubs) {
        List<Club> sortedClubs = clubs.stream()
                .sorted(Comparator.comparing(Club::getId))
                .collect(Collectors.toList());
        List<Fixture> fixtures = new ArrayList<>();
        List<FixturePair> pairings = buildHomeAwayPairs(sortedClubs);
        OffsetDateTime firstMatchDay = nextMatchDay(league.getDefaultMatchDay());

        for (int index = 0; index < pairings.size(); index++) {
            FixturePair pair = pairings.get(index);
            OffsetDateTime kickoffAt = kickoffForIndex(firstMatchDay, index);
            Fixture fixture = new Fixture();
            fixture.setLeague(league);
            fixture.setHomeClub(pair.home());
            fixture.setAwayClub(pair.away());
            fixture.setKickoffAt(kickoffAt);
            fixtures.add(fixture);
        }
        return fixtures;
    }

    private OffsetDateTime kickoffForIndex(OffsetDateTime firstMatchDay, int index) {
        int weeksToAdd = index / MATCHES_PER_DAY;
        int slotWithinDay = index % MATCHES_PER_DAY;
        return firstMatchDay
                .plusWeeks(weeksToAdd)
                .withHour(FIRST_KICKOFF.getHour())
                .withMinute(FIRST_KICKOFF.getMinute())
                .plusHours((long) slotWithinDay * HOURS_BETWEEN_MATCHES);
    }

    private OffsetDateTime nextMatchDay(DayOfWeek matchDay) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        LocalDate next = today;
        while (next.getDayOfWeek() != matchDay) {
            next = next.plusDays(1);
        }
        return next.atTime(FIRST_KICKOFF).atOffset(ZoneOffset.UTC);
    }

    private List<FixturePair> buildHomeAwayPairs(List<Club> clubs) {
        List<FixturePair> pairs = new ArrayList<>();
        for (int i = 0; i < clubs.size(); i++) {
            for (int j = i + 1; j < clubs.size(); j++) {
                pairs.add(new FixturePair(clubs.get(i), clubs.get(j)));
                pairs.add(new FixturePair(clubs.get(j), clubs.get(i)));
            }
        }
        return pairs;
    }
}

record FixturePair(Club home, Club away) {
}
