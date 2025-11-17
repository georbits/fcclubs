package com.fcclubs.backend.repository;

import com.fcclubs.backend.domain.League;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeagueRepository extends JpaRepository<League, Long> {
}
