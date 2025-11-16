package com.fcclubs.backend.api.clubs;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.club.ClubRepository;
import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserAccountRepository;
import com.fcclubs.backend.domain.user.UserRole;

@Service
public class ClubAdminService {

    private final ClubRepository clubRepository;
    private final UserAccountRepository userAccountRepository;

    public ClubAdminService(ClubRepository clubRepository, UserAccountRepository userAccountRepository) {
        this.clubRepository = clubRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional
    public Club createClub(ClubCreateRequest request) {
        ensureNameAvailable(request.name());
        ensureShortCodeAvailable(request.shortCode());

        UserAccount manager = userAccountRepository
                .findById(request.managerUserId())
                .orElseThrow(() -> new ClubManagerNotFoundException(request.managerUserId()));

        promoteManagerIfNeeded(manager);

        Club club = new Club();
        club.setName(request.name());
        club.setShortCode(request.shortCode().toUpperCase());
        club.setLogoUrl(request.logoUrl());
        club.setManager(manager);
        club.getPlayers().add(manager);
        club.setUpdatedAt(OffsetDateTime.now());

        return clubRepository.save(club);
    }

    private void ensureNameAvailable(String name) {
        if (clubRepository.existsByNameIgnoreCase(name)) {
            throw new ClubConflictException("Club name already in use: " + name);
        }
    }

    private void ensureShortCodeAvailable(String shortCode) {
        if (clubRepository.existsByShortCodeIgnoreCase(shortCode)) {
            throw new ClubConflictException("Club short code already in use: " + shortCode);
        }
    }

    private void promoteManagerIfNeeded(UserAccount manager) {
        if (manager.getRole() == UserRole.PLAYER) {
            manager.setRole(UserRole.CLUB_MANAGER);
        }
        manager.setUpdatedAt(OffsetDateTime.now());
    }
}
