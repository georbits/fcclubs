package com.fcclubs.backend.domain.league;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FixtureRepository extends JpaRepository<Fixture, Long> {

    List<Fixture> findByLeagueIdOrderByKickoffAt(Long leagueId);
}
