package com.fcclubs.backend.api.clubs;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clubs")
public class ClubQueryController {

    private final ClubQueryService clubQueryService;

    public ClubQueryController(ClubQueryService clubQueryService) {
        this.clubQueryService = clubQueryService;
    }

    @GetMapping("/{clubId}")
    public ClubDetailsResponse getClubDetails(@PathVariable Long clubId) {
        return clubQueryService.getClubDetails(clubId);
    }
}
