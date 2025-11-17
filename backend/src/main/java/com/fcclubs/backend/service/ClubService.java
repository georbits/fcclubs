package com.fcclubs.backend.service;

import com.fcclubs.backend.domain.Club;
import com.fcclubs.backend.domain.Role;
import com.fcclubs.backend.domain.User;
import com.fcclubs.backend.dto.AddPlayerRequest;
import com.fcclubs.backend.dto.CreateClubRequest;
import com.fcclubs.backend.repository.ClubRepository;
import com.fcclubs.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ClubService {
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    public ClubService(ClubRepository clubRepository, UserRepository userRepository) {
        this.clubRepository = clubRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Club createClub(CreateClubRequest request) {
        User manager = userRepository.findById(request.getManagerUserId())
                .orElseThrow(() -> new IllegalArgumentException("Manager user not found"));
        manager.addRole(Role.MANAGER);
        Club club = new Club();
        club.setName(request.getName());
        club.setShortCode(request.getShortCode());
        club.setLogoUrl(request.getLogoUrl());
        club.setManager(manager);
        club.getPlayers().add(manager);
        return clubRepository.save(club);
    }

    @Transactional
    public Club addPlayerToClub(Long actingUserId, Long clubId, AddPlayerRequest request) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));
        ensureManagerOrAdmin(actingUserId, club);
        User player = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        club.getPlayers().add(player);
        return club;
    }

    @Transactional
    public Club removePlayer(Long actingUserId, Long clubId, Long playerId) {
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));
        ensureManagerOrAdmin(actingUserId, club);
        if (club.getManager().getId().equals(playerId)) {
            throw new IllegalArgumentException("Cannot remove the manager from the roster");
        }
        club.getPlayers().removeIf(user -> user.getId().equals(playerId));
        return club;
    }

    private void ensureManagerOrAdmin(Long userId, Club club) {
        if (club.getManager().getId().equals(userId)) {
            return;
        }
        User actingUser = userRepository.findById(userId)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        if (!actingUser.getRoles().contains(Role.ADMIN)) {
            throw new AccessDeniedException("User is not authorized for this club");
        }
    }
}
