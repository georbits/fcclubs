# Backend Service

This folder now contains the Spring Boot service that powers the FC26 Pro Clubs
Tournament platform. The project ships with a PostgreSQL data model, Flyway
migrations, OAuth2 resource-server security, and a simple `/api/health` probe so
we can verify deployments end-to-end while we build out the remaining features.

## Tech Stack
- Java 21 with Spring Boot 3.3
- Spring Data JPA + PostgreSQL
- Spring Security with OAuth2 resource server (JWT bearer tokens)
- Flyway for schema migrations
- Maven for builds/tests

## Local Development
1. Ensure PostgreSQL is running and reachable (see environment variables
   below).
2. From the `backend/` directory run `mvn spring-boot:run` to start the API.
3. Call `GET http://localhost:8080/api/health` to confirm the service is up.
4. Register a new account via `POST http://localhost:8080/api/auth/register`
   (see payload below) to seed initial users.
5. Authenticate via OAuth2 and call `GET/PUT http://localhost:8080/api/profile`
   to read or update the authenticated user's profile information.
6. Promote yourself to an admin (via database for now) and call
   `POST http://localhost:8080/api/clubs` to seed club data.

```json
{
  "email": "captain@example.com",
  "displayName": "Club Captain",
  "password": "changeme123",
  "platform": "EA",
  "platformHandle": "captain-handle",
  "profileImageUrl": null
}
```

### Profile Management

Authenticated users can manage their profiles through the `/api/profile`
endpoint once they present a valid JWT. `GET /api/profile` returns the persisted
user metadata while `PUT /api/profile` updates the record. The update payload
requires the same fields as registration plus an optional `newPassword` field if
the user wants to rotate credentials:

```json
{
  "email": "captain@example.com",
  "displayName": "Club Captain",
  "platform": "EA",
  "platformHandle": "captain-handle",
  "profileImageUrl": "https://cdn.example.com/profile.png",
  "newPassword": "better-password-123"
}
```

### Club Administration

Administrators can create new clubs via `POST /api/clubs`. Provide a name, short
code, optional logo URL, and the ID of the user who should manage the club.
Managers automatically receive the `CLUB_MANAGER` role and are added to the
roster.

```json
{
  "name": "Aurora FC",
  "shortCode": "AFC",
  "logoUrl": "https://cdn.example.com/aurora.png",
  "managerUserId": 42
}
```

### League Administration

Administrators can stand up leagues via `POST /api/leagues`. Supply a unique
name, a season label, optional `defaultMatchDay` (defaults to Sunday), and at
least two club IDs. The service registers the clubs to the league and creates a
double round-robin fixture list with two matches per match day starting on the
next default day at 18:00 UTC.

```json
{
  "name": "FC26 Premier League",
  "season": "2024",
  "defaultMatchDay": "SUNDAY",
  "clubIds": [1, 2, 3, 4]
}
```

The response includes the persisted league metadata plus how many fixtures were
scheduled so admins can confirm the generated bracket.

### Club Roster Management

Managers and administrators can collaborate on the roster through the secured
`/api/clubs/{clubId}/players` endpoints. Requests require the acting user to be
either the assigned manager for the club or an admin and return the updated
roster snapshot in the response.

- `POST /api/clubs/{clubId}/players` adds an existing user to the roster:

```json
{
  "userId": 123
}
```

- `DELETE /api/clubs/{clubId}/players/{playerId}` removes a rostered player
  (except the manager). Both endpoints return the latest roster so club staff
  can refresh their UI without an additional fetch.

### Match Results

Club managers (or administrators) can file final scores for scheduled fixtures
via `POST /api/matches/{fixtureId}/result`. The caller must manage one of the
participating clubs (or hold the `ADMIN` role). Results cannot be overwritten
once marked complete.

```json
{
  "homeScore": 3,
  "awayScore": 1
}
```

### Configuration
The application reads configuration from `application.yml` with sensible
defaults. Override them with environment variables when necessary:

| Variable | Purpose | Default |
| --- | --- | --- |
| `DB_HOST` / `DB_PORT` | PostgreSQL location | `localhost` / `5432` |
| `DB_NAME` | Database name | `fcclubs` |
| `DB_USERNAME` / `DB_PASSWORD` | Database credentials | `fcclubs` |
| `OAUTH_ISSUER_URI` | JWT issuer for OAuth2 resource server | `https://example.com/issuer` |
| `APP_VERSION` | Value returned by `/api/health` | `dev` |

Flyway will apply the baseline schema automatically on startup.

## Next Steps
- Build profile management and club admin flows on top of the user repository
  introduced here.
- Flesh out league scheduling endpoints backed by Spring Data repositories.
- Add integration tests backed by Testcontainers.
