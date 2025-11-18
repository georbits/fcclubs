# Backend API stack status

## Why the legacy MVC layer was removed
The Spring MVC controllers, DTOs, repositories, and services under `com.fcclubs.backend.controller` were superseded by the newer `/api` namespace. Keeping both stacks caused bean duplication and competing persistence models, so the legacy layer was deleted to avoid loading obsolete mappings and to align everything on the current API surface.

## What replaces the legacy components
- **REST endpoints**: Controllers now live under `com.fcclubs.backend.api.*` (for example, `api.auth.AuthController` handles `/api/auth/register`). They delegate to focused services instead of the older monolithic service classes.
- **Request/response records**: DTOs are declared alongside each controller (e.g., `RegistrationRequest`/`RegistrationResponse` in `api.auth`) so validation rules sit next to the endpoints that use them.
- **Domain + repositories**: Persistence is handled by the consolidated domain model in `com.fcclubs.backend.domain.*`, such as `UserAccount` and `UserAccountRepository`, rather than the duplicated entity/repository pairs from the legacy layer. This model backs both auth and profile flows and will be extended as clubs, leagues, and matches are fleshed out.
- **Service layer**: New services (e.g., `RegistrationService`, `ProfileService`) encapsulate business logic per feature area and operate on the new domain entities.

This consolidation ensures the backend only exposes the `/api` stack and eliminates conflicts from the deprecated MVC classes.
