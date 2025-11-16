# FC26 Pro Clubs Tournament Platform

This repository will host the FC26 Pro Clubs Tournament web platform, consisting
of an Angular SPA frontend and a Spring Boot REST API backend backed by
PostgreSQL and OAuth2 authentication.

## Repository Layout
- `frontend/` – Angular workspace (to be scaffolded) with public and private
  feature areas.
- `backend/` – Spring Boot project (to be scaffolded) implementing the REST API
  and PostgreSQL integrations.
- `docs/` – Architecture notes and product requirements.

## Getting Started
1. Review [`docs/system-overview.md`](docs/system-overview.md) for the initial
   requirements, architecture, and API sketch.
2. Bootstrap the Angular app (recommended: Angular CLI + NgRx) under
   `frontend/`.
3. Scaffold the Spring Boot service under `backend/`, configure OAuth2, and
   define database migrations.
4. Connect the SPA to the API endpoints, iterating on leagues, clubs, and match
   result workflows.

Additional deployment, infrastructure, and CI/CD instructions will be added as
we implement the system.
