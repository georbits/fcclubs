package com.fcclubs.backend.controller;

import com.fcclubs.backend.domain.Club;
import com.fcclubs.backend.dto.AddPlayerRequest;
import com.fcclubs.backend.dto.CreateClubRequest;
import com.fcclubs.backend.repository.ClubRepository;
import com.fcclubs.backend.service.ClubService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clubs")
public class ClubController {

    private final ClubService clubService;
    private final ClubRepository clubRepository;

    public ClubController(ClubService clubService, ClubRepository clubRepository) {
        this.clubService = clubService;
        this.clubRepository = clubRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Club> create(@Valid @RequestBody CreateClubRequest request) {
        Club club = clubService.createClub(request);
        return ResponseEntity.ok(club);
    }

    @PostMapping("/{clubId}/players")
    public ResponseEntity<Club> addPlayer(Authentication authentication,
                                          @PathVariable Long clubId,
                                          @Valid @RequestBody AddPlayerRequest request) {
        Long actingUserId = subjectAsUserId(authentication);
        Club club = clubService.addPlayerToClub(actingUserId, clubId, request);
        return ResponseEntity.ok(club);
    }

    @DeleteMapping("/{clubId}/players/{playerId}")
    public ResponseEntity<Club> removePlayer(Authentication authentication,
                                             @PathVariable Long clubId,
                                             @PathVariable Long playerId) {
        Long actingUserId = subjectAsUserId(authentication);
        Club club = clubService.removePlayer(actingUserId, clubId, playerId);
        return ResponseEntity.ok(club);
    }

    @GetMapping("/{clubId}")
    public ResponseEntity<Club> getClub(@PathVariable Long clubId) {
        return clubRepository.findById(clubId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private Long subjectAsUserId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return Long.parseLong(jwt.getSubject());
    }
}
