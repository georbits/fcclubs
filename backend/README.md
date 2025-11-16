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
