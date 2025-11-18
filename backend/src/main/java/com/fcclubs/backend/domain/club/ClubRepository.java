package com.fcclubs.backend.domain.club;

import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByShortCodeIgnoreCase(String shortCode);

    @EntityGraph(attributePaths = {"players", "manager"})
    Optional<Club> findWithRosterById(Long id);
}
