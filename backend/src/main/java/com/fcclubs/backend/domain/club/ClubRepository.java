package com.fcclubs.backend.domain.club;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByShortCodeIgnoreCase(String shortCode);
}
