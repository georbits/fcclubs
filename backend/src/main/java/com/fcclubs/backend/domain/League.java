package com.fcclubs.backend.domain;

import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "leagues")
public class League extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String season;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DayOfWeek defaultMatchDay = DayOfWeek.SUNDAY;

    @ManyToMany
    @JoinTable(
            name = "league_clubs",
            joinColumns = @JoinColumn(name = "league_id"),
            inverseJoinColumns = @JoinColumn(name = "club_id")
    )
    private Set<Club> clubs = new HashSet<>();

    @OneToMany(mappedBy = "league", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Fixture> fixtures = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public DayOfWeek getDefaultMatchDay() {
        return defaultMatchDay;
    }

    public void setDefaultMatchDay(DayOfWeek defaultMatchDay) {
        this.defaultMatchDay = defaultMatchDay;
    }

    public Set<Club> getClubs() {
        return clubs;
    }

    public List<Fixture> getFixtures() {
        return fixtures;
    }
}
