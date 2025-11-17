package com.fcclubs.backend.controller;

import com.fcclubs.backend.dto.CreateLeagueRequest;
import com.fcclubs.backend.dto.LeagueSummaryResponse;
import com.fcclubs.backend.dto.StandingsRow;
import com.fcclubs.backend.service.LeagueService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leagues")
public class LeagueController {

    private final LeagueService leagueService;

    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LeagueSummaryResponse> create(@Valid @RequestBody CreateLeagueRequest request) {
        return ResponseEntity.ok(leagueService.createLeague(request));
    }

    @GetMapping("/{leagueId}/standings")
    public ResponseEntity<List<StandingsRow>> standings(@PathVariable Long leagueId) {
        return ResponseEntity.ok(leagueService.computeStandings(leagueId));
    }
}
