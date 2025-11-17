package com.fcclubs.backend.repository;

import com.fcclubs.backend.domain.Fixture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FixtureRepository extends JpaRepository<Fixture, Long> {
    List<Fixture> findByLeagueId(Long leagueId);
}
