# FC26 Pro Clubs Tournament Platform

This repository will host the FC26 Pro Clubs Tournament web platform, consisting
of an Angular SPA frontend and a Spring Boot REST API backend backed by
PostgreSQL and OAuth2 authentication.

## Repository Layout
- `frontend/` – Angular workspace (to be scaffolded) with public and private
  feature areas.
- `backend/` – Spring Boot service that exposes the REST API, PostgreSQL data
  model, Flyway migrations, and OAuth2 resource server configuration.
- `docs/` – Architecture notes and product requirements.

## Getting Started
1. Review [`docs/system-overview.md`](docs/system-overview.md) for the initial
   requirements, architecture, and API sketch.
2. Explore the Spring Boot backend under `backend/` and configure local
   PostgreSQL/OAuth settings per its README.
3. Bootstrap the Angular app (recommended: Angular CLI + NgRx) under
   `frontend/`.
4. Connect the SPA to the API endpoints, iterating on leagues, clubs, and match
   result workflows.

Additional deployment, infrastructure, and CI/CD instructions will be added as
we implement the system.
