package com.fcclubs.backend.service;

import com.fcclubs.backend.domain.Club;
import com.fcclubs.backend.domain.Fixture;
import com.fcclubs.backend.domain.League;
import com.fcclubs.backend.dto.CreateLeagueRequest;
import com.fcclubs.backend.dto.LeagueSummaryResponse;
import com.fcclubs.backend.dto.StandingsRow;
import com.fcclubs.backend.repository.ClubRepository;
import com.fcclubs.backend.repository.FixtureRepository;
import com.fcclubs.backend.repository.LeagueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeagueService {
    private final LeagueRepository leagueRepository;
    private final ClubRepository clubRepository;
    private final FixtureRepository fixtureRepository;

    public LeagueService(LeagueRepository leagueRepository, ClubRepository clubRepository, FixtureRepository fixtureRepository) {
        this.leagueRepository = leagueRepository;
        this.clubRepository = clubRepository;
        this.fixtureRepository = fixtureRepository;
    }

    @Transactional
    public LeagueSummaryResponse createLeague(CreateLeagueRequest request) {
        List<Club> clubs = clubRepository.findAllById(request.getClubIds());
        if (clubs.size() < 2) {
            throw new IllegalArgumentException("At least two clubs are required for a league");
        }
        League league = new League();
        league.setName(request.getName());
        league.setSeason(request.getSeason());
        league.setDefaultMatchDay(Optional.ofNullable(request.getDefaultMatchDay()).orElse(DayOfWeek.SUNDAY));
        league.getClubs().addAll(clubs);
        league = leagueRepository.save(league);

        List<Fixture> fixtures = generateFixtures(league, clubs);
        fixtureRepository.saveAll(fixtures);

        LeagueSummaryResponse response = new LeagueSummaryResponse();
        response.setId(league.getId());
        response.setName(league.getName());
        response.setSeason(league.getSeason());
        response.setRegisteredClubs(clubs.size());
        response.setFixturesScheduled(fixtures.size());
        return response;
    }

    public List<StandingsRow> computeStandings(Long leagueId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new IllegalArgumentException("League not found"));
        Map<Long, StandingsRow> table = new HashMap<>();
        for (Club club : league.getClubs()) {
            StandingsRow row = new StandingsRow();
            row.setClubId(club.getId());
            row.setClubName(club.getName());
            row.setShortCode(club.getShortCode());
            table.put(club.getId(), row);
        }

        List<Fixture> fixtures = fixtureRepository.findByLeagueId(leagueId);
        for (Fixture fixture : fixtures) {
            if (fixture.getHomeScore() == null || fixture.getAwayScore() == null) {
                continue;
            }
            updateRow(table.get(fixture.getHomeClub().getId()), fixture.getHomeScore(), fixture.getAwayScore());
            updateRow(table.get(fixture.getAwayClub().getId()), fixture.getAwayScore(), fixture.getHomeScore());
        }
        return table.values().stream().sorted().collect(Collectors.toList());
    }

    private void updateRow(StandingsRow row, int goalsFor, int goalsAgainst) {
        row.setPlayed(row.getPlayed() + 1);
        row.setGoalsFor(row.getGoalsFor() + goalsFor);
        row.setGoalsAgainst(row.getGoalsAgainst() + goalsAgainst);
        if (goalsFor > goalsAgainst) {
            row.setWins(row.getWins() + 1);
        } else if (goalsFor == goalsAgainst) {
            row.setDraws(row.getDraws() + 1);
        } else {
            row.setLosses(row.getLosses() + 1);
        }
    }

    private List<Fixture> generateFixtures(League league, List<Club> clubs) {
        List<Fixture> fixtures = new ArrayList<>();
        List<Club> rotation = new ArrayList<>(clubs);
        if (rotation.size() % 2 != 0) {
            rotation.add(null); // bye week placeholder
        }
        int rounds = (rotation.size() - 1) * 2;
        int matchesPerRound = rotation.size() / 2;
        LocalDateTime startDate = nextMatchDate(league.getDefaultMatchDay());

        for (int round = 0; round < rounds; round++) {
            for (int match = 0; match < matchesPerRound; match++) {
                Club home = rotation.get(match);
                Club away = rotation.get(rotation.size() - 1 - match);
                if (home == null || away == null) {
                    continue;
                }
                Fixture fixture = new Fixture();
                fixture.setLeague(league);
                if (round % 2 == 0) {
                    fixture.setHomeClub(home);
                    fixture.setAwayClub(away);
                } else {
                    fixture.setHomeClub(away);
                    fixture.setAwayClub(home);
                }
                fixture.setScheduledAt(startDate.plusWeeks(round / matchesPerRound));
                fixtures.add(fixture);
            }
            rotate(rotation);
        }
        return fixtures;
    }

    private LocalDateTime nextMatchDate(DayOfWeek matchDay) {
        LocalDate today = LocalDate.now();
        int daysUntil = (matchDay.getValue() - today.getDayOfWeek().getValue() + 7) % 7;
        if (daysUntil == 0) {
            daysUntil = 7;
        }
        return today.plusDays(daysUntil).atTime(LocalTime.of(18, 0));
    }

    private void rotate(List<Club> clubs) {
        if (clubs.size() <= 2) {
            return;
        }
        Club fixed = clubs.get(0);
        List<Club> rest = new ArrayList<>(clubs.subList(1, clubs.size()));
        Collections.rotate(rest, 1);
        clubs.clear();
        clubs.add(fixed);
        clubs.addAll(rest);
    }
}
