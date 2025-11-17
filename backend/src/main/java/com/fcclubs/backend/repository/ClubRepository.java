package com.fcclubs.backend.repository;

import com.fcclubs.backend.domain.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubRepository extends JpaRepository<Club, Long> {
}
