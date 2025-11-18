# FC26 Pro Clubs Tournament Platform

This repository hosts the FC26 Pro Clubs Tournament web platform, consisting of an Angular SPA frontend and a Spring Boot REST API backend backed by PostgreSQL and OAuth2 authentication.

## Repository Layout
- `frontend/` – Angular SPA scaffolded with routing, Material/Tailwind styling, and NgRx wiring for public and private feature areas.
- `backend/` – Spring Boot service that exposes the REST API, PostgreSQL data model, Flyway migrations, and OAuth2 resource server configuration.
- `docs/` – Architecture notes and product requirements.

## Getting Started
1. Review [`docs/system-overview.md`](docs/system-overview.md) for the requirements, architecture, and API sketch.
2. Backend: explore `backend/` and configure local PostgreSQL/OAuth settings per its README.
3. Frontend: see `frontend/README.md` for npm setup and route structure; run `npm install` then `npm start` to serve the SPA.
4. Connect the SPA to the API endpoints, iterating on leagues, clubs, and match result workflows.

Additional deployment, infrastructure, and CI/CD instructions will be added as we implement the system.

## Running locally with Docker Compose
The repository ships with a Compose file that builds and runs the full stack: PostgreSQL, the Spring Boot API, and the production Angular build served by Nginx.

```bash
docker compose up --build
```

- Frontend: http://localhost:4200
- Backend API/health: http://localhost:8080/api/health
- PostgreSQL: localhost:5432 (database/user/password: `fcclubs`)
- Default admin (seeded by the Postgres init script on first launch): `admin@fcclubs.local` / `admin1234`

Stop the stack with `docker compose down` (add `-v` to remove the persisted database volume).
