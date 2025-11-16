package com.fcclubs.backend.domain.league;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LeagueRepository extends JpaRepository<League, Long> {

    boolean existsByNameIgnoreCase(String name);
}
