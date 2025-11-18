package com.fcclubs.backend.api.clubs;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fcclubs.backend.domain.club.ClubRepository;
import com.fcclubs.backend.domain.league.FixtureRepository;

@Service
public class ClubQueryService {

    private final ClubRepository clubRepository;
    private final FixtureRepository fixtureRepository;

    public ClubQueryService(ClubRepository clubRepository, FixtureRepository fixtureRepository) {
        this.clubRepository = clubRepository;
        this.fixtureRepository = fixtureRepository;
    }

    @Transactional(readOnly = true)
    public ClubDetailsResponse getClubDetails(Long clubId) {
        var club = clubRepository
                .findWithRosterById(clubId)
                .orElseThrow(() -> new ClubNotFoundException(clubId));

        var fixtures = fixtureRepository.findRecentCompletedByClubId(clubId, PageRequest.of(0, 2));

        return ClubDetailsResponse.from(club, fixtures, clubId);
    }
}
