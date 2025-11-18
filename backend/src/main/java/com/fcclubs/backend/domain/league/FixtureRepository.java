package com.fcclubs.backend.domain.league;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FixtureRepository extends JpaRepository<Fixture, Long> {

    List<Fixture> findByLeagueIdOrderByKickoffAt(Long leagueId);

    @Query("""
            select f from Fixture f
            join fetch f.league l
            join fetch f.homeClub hc
            join fetch f.awayClub ac
            where f.status = com.fcclubs.backend.domain.league.FixtureStatus.COMPLETED
            and (hc.id = :clubId or ac.id = :clubId)
            order by f.kickoffAt desc
            """)
    List<Fixture> findRecentCompletedByClubId(@Param("clubId") Long clubId, Pageable pageable);
}
