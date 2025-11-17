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
public class ClubRosterService {

    private final ClubRepository clubRepository;
    private final UserAccountRepository userAccountRepository;

    public ClubRosterService(ClubRepository clubRepository, UserAccountRepository userAccountRepository) {
        this.clubRepository = clubRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional
    public Club addPlayer(Long clubId, Long playerUserId, String actorEmail) {
        Club club = loadClub(clubId);
        UserAccount actor = loadActor(actorEmail);
        ensureCanManage(actor, club);

        UserAccount player = userAccountRepository
                .findById(playerUserId)
                .orElseThrow(() -> new ClubPlayerNotFoundException(playerUserId));

        boolean alreadyInClub = club.getPlayers().stream()
                .anyMatch(existing -> existing.getId().equals(player.getId()));
        if (alreadyInClub) {
            throw new ClubRosterConflictException("Player already registered to this club: " + playerUserId);
        }

        club.getPlayers().add(player);
        club.setUpdatedAt(OffsetDateTime.now());
        return clubRepository.save(club);
    }

    @Transactional
    public Club removePlayer(Long clubId, Long playerUserId, String actorEmail) {
        Club club = loadClub(clubId);
        UserAccount actor = loadActor(actorEmail);
        ensureCanManage(actor, club);

        if (club.getManager() != null && club.getManager().getId().equals(playerUserId)) {
            throw new ClubRosterConflictException("Cannot remove the club manager from the roster");
        }

        boolean removed = club.getPlayers().removeIf(player -> player.getId().equals(playerUserId));
        if (!removed) {
            throw new ClubRosterConflictException("Player not assigned to this club: " + playerUserId);
        }

        club.setUpdatedAt(OffsetDateTime.now());
        return clubRepository.save(club);
    }

    private Club loadClub(Long clubId) {
        return clubRepository
                .findById(clubId)
                .orElseThrow(() -> new ClubNotFoundException(clubId));
    }

    private UserAccount loadActor(String actorEmail) {
        return userAccountRepository
                .findByEmailIgnoreCase(actorEmail)
                .orElseThrow(() -> new ClubActorNotFoundException(actorEmail));
    }

    private void ensureCanManage(UserAccount actor, Club club) {
        if (actor.getRole() == UserRole.ADMIN) {
            return;
        }
        if (club.getManager() != null && club.getManager().getId().equals(actor.getId())) {
            return;
        }
        throw new ClubPermissionException(club.getId());
    }
}
