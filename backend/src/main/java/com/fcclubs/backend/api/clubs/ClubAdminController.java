package com.fcclubs.backend.api.clubs;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/clubs")
public class ClubAdminController {

    private final ClubAdminService clubAdminService;

    public ClubAdminController(ClubAdminService clubAdminService) {
        this.clubAdminService = clubAdminService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ClubResponse createClub(@Valid @RequestBody ClubCreateRequest request) {
        return ClubResponse.from(clubAdminService.createClub(request));
    }
}
