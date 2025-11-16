# Backend Plan

The backend will be a Spring Boot 3 project with the following modules:

1. **API**: Controllers, DTOs, request validation, and error handling.
2. **Application**: Services implementing business logic for leagues, clubs, and profiles.
3. **Infrastructure**: PostgreSQL persistence via Spring Data JPA, Flyway migrations, Amazon S3 client for media storage, and OAuth2 resource server configuration.
4. **Configuration**: Profiles for dev/stage/prod, with AWS Secrets Manager storing credentials.

Key tasks for the first iteration:
- Scaffold Gradle/Maven project and configure Spring Security with OAuth2 login.
- Define entities (`User`, `Club`, `League`, `Fixture`, `Result`) and Flyway migration scripts.
- Implement the registration endpoint plus profile CRUD.
- Provide admin endpoints for creating clubs, assigning managers, creating leagues, and generating fixtures.
- Add unit and integration tests (Testcontainers for PostgreSQL).
