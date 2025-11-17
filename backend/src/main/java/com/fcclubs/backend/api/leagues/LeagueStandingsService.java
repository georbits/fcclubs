package com.fcclubs.backend.api.leagues;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.league.Fixture;
import com.fcclubs.backend.domain.league.FixtureRepository;
import com.fcclubs.backend.domain.league.FixtureStatus;
import com.fcclubs.backend.domain.league.League;
import com.fcclubs.backend.domain.league.LeagueRepository;

@Service
public class LeagueStandingsService {

    private final LeagueRepository leagueRepository;
    private final FixtureRepository fixtureRepository;

    public LeagueStandingsService(LeagueRepository leagueRepository, FixtureRepository fixtureRepository) {
        this.leagueRepository = leagueRepository;
        this.fixtureRepository = fixtureRepository;
    }

    @Transactional(readOnly = true)
    public LeagueStandingsResponse fetchStandings(Long leagueId) {
        League league = leagueRepository.findById(leagueId).orElseThrow(() -> new LeagueNotFoundException(leagueId));

        Map<Long, MutableStanding> table = initializeTable(league.getClubs());
        List<Fixture> fixtures = fixtureRepository.findByLeagueIdOrderByKickoffAt(leagueId);

        fixtures.stream()
                .filter(this::hasRecordedScore)
                .forEach(fixture -> applyResult(table, fixture));

        List<LeagueStandingRow> sorted = table.values().stream()
                .sorted(standingComparator())
                .map(MutableStanding::toRow)
                .toList();

        return new LeagueStandingsResponse(league.getId(), league.getName(), league.getSeason(), sorted);
    }

    private Map<Long, MutableStanding> initializeTable(Iterable<Club> clubs) {
        Map<Long, MutableStanding> table = new HashMap<>();
        for (Club club : clubs) {
            table.put(club.getId(), new MutableStanding(club));
        }
        return table;
    }

    private boolean hasRecordedScore(Fixture fixture) {
        boolean finished = fixture.getStatus() == FixtureStatus.COMPLETED || fixture.getStatus() == FixtureStatus.FORFEITED;
        return finished && fixture.getHomeScore() != null && fixture.getAwayScore() != null;
    }

    private void applyResult(Map<Long, MutableStanding> table, Fixture fixture) {
        MutableStanding home = table.get(fixture.getHomeClub().getId());
        MutableStanding away = table.get(fixture.getAwayClub().getId());

        if (home == null || away == null) {
            return;
        }

        home.recordMatch(fixture.getHomeScore(), fixture.getAwayScore());
        away.recordMatch(fixture.getAwayScore(), fixture.getHomeScore());
    }

    private Comparator<MutableStanding> standingComparator() {
        return Comparator.comparingInt(MutableStanding::points).reversed()
                .thenComparing(Comparator.comparingInt(MutableStanding::goalDifference).reversed())
                .thenComparing(Comparator.comparingInt(MutableStanding::goalsFor).reversed())
                .thenComparing(MutableStanding::clubName);
    }

    private static class MutableStanding {
        private final Club club;
        private int played;
        private int wins;
        private int draws;
        private int losses;
        private int goalsFor;
        private int goalsAgainst;

        MutableStanding(Club club) {
            this.club = club;
        }

        void recordMatch(int scored, int conceded) {
            played++;
            goalsFor += scored;
            goalsAgainst += conceded;

            if (scored > conceded) {
                wins++;
            } else if (scored == conceded) {
                draws++;
            } else {
                losses++;
            }
        }

        int points() {
            return wins * 3 + draws;
        }

        int goalDifference() {
            return goalsFor - goalsAgainst;
        }

        int goalsFor() {
            return goalsFor;
        }

        String clubName() {
            return club.getName();
        }

        LeagueStandingRow toRow() {
            return new LeagueStandingRow(
                    club.getId(),
                    club.getName(),
                    club.getShortCode(),
                    played,
                    wins,
                    draws,
                    losses,
                    goalsFor,
                    goalsAgainst,
                    goalDifference(),
                    points());
        }
    }
}
