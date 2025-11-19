package com.fcclubs.backend.api.leagues;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/leagues", "/api/public/leagues"})
public class LeagueStandingsController {

    private final LeagueStandingsService leagueStandingsService;

    public LeagueStandingsController(LeagueStandingsService leagueStandingsService) {
        this.leagueStandingsService = leagueStandingsService;
    }

    @GetMapping("/{leagueId}/standings")
    public ResponseEntity<LeagueStandingsResponse> fetchStandings(@PathVariable Long leagueId) {
        LeagueStandingsResponse response = leagueStandingsService.fetchStandings(leagueId);
        return ResponseEntity.ok(response);
    }
}
