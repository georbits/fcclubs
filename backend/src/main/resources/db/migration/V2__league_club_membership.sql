CREATE TABLE IF NOT EXISTS league_clubs (
    league_id BIGINT NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
    club_id BIGINT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    PRIMARY KEY (league_id, club_id)
);
