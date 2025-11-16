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
- Implement repositories/services for the user, club, and league aggregates.
- Expose authentication-aware endpoints for profile management and club admin
  flows.
- Add integration tests backed by Testcontainers.
