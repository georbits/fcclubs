package com.fcclubs.backend.api.clubs;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clubs/{clubId}/players")
public class ClubRosterController {

    private final ClubRosterService clubRosterService;

    public ClubRosterController(ClubRosterService clubRosterService) {
        this.clubRosterService = clubRosterService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','CLUB_MANAGER')")
    public ClubRosterResponse addPlayer(
            @PathVariable Long clubId,
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody ClubPlayerRequest request) {
        String email = resolveEmail(jwt);
        return ClubRosterResponse.from(clubRosterService.addPlayer(clubId, request.userId(), email));
    }

    @DeleteMapping("/{playerId}")
    @PreAuthorize("hasAnyRole('ADMIN','CLUB_MANAGER')")
    public ClubRosterResponse removePlayer(
            @PathVariable Long clubId,
            @PathVariable Long playerId,
            @AuthenticationPrincipal Jwt jwt) {
        String email = resolveEmail(jwt);
        return ClubRosterResponse.from(clubRosterService.removePlayer(clubId, playerId, email));
    }

    private String resolveEmail(Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (StringUtils.hasText(email)) {
            return email;
        }
        return jwt.getSubject();
    }
}
