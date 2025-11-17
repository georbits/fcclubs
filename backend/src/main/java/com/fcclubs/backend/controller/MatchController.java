package com.fcclubs.backend.controller;

import com.fcclubs.backend.domain.Club;
import com.fcclubs.backend.domain.Fixture;
import com.fcclubs.backend.domain.Role;
import com.fcclubs.backend.domain.User;
import com.fcclubs.backend.dto.FixtureResultRequest;
import com.fcclubs.backend.repository.FixtureRepository;
import com.fcclubs.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final FixtureRepository fixtureRepository;
    private final UserRepository userRepository;

    public MatchController(FixtureRepository fixtureRepository, UserRepository userRepository) {
        this.fixtureRepository = fixtureRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/{fixtureId}/result")
    public ResponseEntity<Fixture> reportResult(Authentication authentication,
                                                @PathVariable Long fixtureId,
                                                @Valid @RequestBody FixtureResultRequest request) {
        Long userId = subjectAsUserId(authentication);
        Fixture fixture = fixtureRepository.findById(fixtureId)
                .orElseThrow(() -> new IllegalArgumentException("Fixture not found"));
        requireManagerOrAdmin(userId, fixture);
        if (fixture.isLocked()) {
            return ResponseEntity.badRequest().build();
        }
        fixture.setHomeScore(request.getHomeScore());
        fixture.setAwayScore(request.getAwayScore());
        fixture.setLocked(true);
        Fixture saved = fixtureRepository.save(fixture);
        return ResponseEntity.ok(saved);
    }

    private void requireManagerOrAdmin(Long userId, Fixture fixture) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AccessDeniedException("User not found"));
        Club home = fixture.getHomeClub();
        Club away = fixture.getAwayClub();
        boolean manager = home.getManager().getId().equals(userId) || away.getManager().getId().equals(userId);
        boolean admin = user.getRoles().contains(Role.ADMIN);
        if (!manager && !admin) {
            throw new AccessDeniedException("User cannot update this fixture");
        }
    }

    private Long subjectAsUserId(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();
        return Long.parseLong(jwt.getSubject());
    }
}
