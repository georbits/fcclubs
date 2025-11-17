package com.fcclubs.backend.api.leagues;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/leagues")
public class LeagueAdminController {

    private final LeagueAdminService leagueAdminService;

    public LeagueAdminController(LeagueAdminService leagueAdminService) {
        this.leagueAdminService = leagueAdminService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public LeagueResponse createLeague(@Valid @RequestBody LeagueCreateRequest request) {
        LeagueCreationResult result = leagueAdminService.createLeague(request);
        return LeagueResponse.from(result.league(), result.fixturesCreated());
    }
}
