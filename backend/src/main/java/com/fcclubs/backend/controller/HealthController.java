package com.fcclubs.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Value("${app.version:dev}")
    private String version;

    @GetMapping
    public Map<String, Object> health() {
        return Map.of(
                "status", "ok",
                "version", version,
                "timestamp", Instant.now().toString()
        );
    }
}
