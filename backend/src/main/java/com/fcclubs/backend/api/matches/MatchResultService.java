package com.fcclubs.backend.api.matches;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fcclubs.backend.domain.club.Club;
import com.fcclubs.backend.domain.league.Fixture;
import com.fcclubs.backend.domain.league.FixtureRepository;
import com.fcclubs.backend.domain.league.FixtureStatus;
import com.fcclubs.backend.domain.user.UserAccount;
import com.fcclubs.backend.domain.user.UserAccountRepository;
import com.fcclubs.backend.domain.user.UserRole;

@Service
public class MatchResultService {

    private final FixtureRepository fixtureRepository;
    private final UserAccountRepository userAccountRepository;

    public MatchResultService(FixtureRepository fixtureRepository, UserAccountRepository userAccountRepository) {
        this.fixtureRepository = fixtureRepository;
        this.userAccountRepository = userAccountRepository;
    }

    @Transactional
    public Fixture submitResult(Long fixtureId, int homeScore, int awayScore, String actorEmail) {
        Fixture fixture = fixtureRepository
                .findById(fixtureId)
                .orElseThrow(() -> new MatchNotFoundException(fixtureId));
        UserAccount actor = userAccountRepository
                .findByEmailIgnoreCase(actorEmail)
                .orElseThrow(() -> new MatchActorNotFoundException(actorEmail));

        ensureCanReport(actor, fixture);
        ensureNotCompleted(fixture);

        fixture.setHomeScore(homeScore);
        fixture.setAwayScore(awayScore);
        fixture.setStatus(FixtureStatus.COMPLETED);
        fixture.getLeague().setUpdatedAt(OffsetDateTime.now());
        return fixtureRepository.save(fixture);
    }

    private void ensureCanReport(UserAccount actor, Fixture fixture) {
        if (actor.getRole() == UserRole.ADMIN) {
            return;
        }
        Club home = fixture.getHomeClub();
        Club away = fixture.getAwayClub();
        if ((home.getManager() != null && home.getManager().getId().equals(actor.getId()))
                || (away.getManager() != null && away.getManager().getId().equals(actor.getId()))) {
            return;
        }
        throw new MatchPermissionException(fixture.getId());
    }

    private void ensureNotCompleted(Fixture fixture) {
        if (fixture.getStatus() == FixtureStatus.COMPLETED || fixture.getStatus() == FixtureStatus.FORFEITED) {
            throw new MatchResultConflictException("Fixture already reported: " + fixture.getId());
        }
    }
}
