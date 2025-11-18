# Agent Handoff Notes

This repository currently tracks both the Spring Boot backend and Angular frontend for the FC26 Pro Clubs Tournament platform. Use these notes as the starting point for the next task.

## Next steps (proposed backlog)
1. **Profile management UI**: implement the profile page form(s) backed by `/api/profile` (view + update, including password change and platform selection) with optimistic UI states.

## Environment reminders
- No remotes are configured in this sandbox; create/update branches locally unless a remote is added.
- Backend Maven tests (`mvn test`) should now work with network access; run them before backend changes.
- Avoid committing binary assets; prefer SVG or text-based alternatives.

## Recent progress
- Removed the legacy Spring MVC layer in favor of the new `/api` stack and deleted duplicate repositories/entities so Maven tests run cleanly again.
- Frontend now has an authentication interceptor that forwards a stored bearer token to `/api` calls (see `src/app/core/auth/auth.interceptor.ts`) and the auth service persists tokens in `localStorage` with basic unit coverage.
- Added a public clubs roster endpoint (`GET /api/clubs/{id}/players`) and wired the Angular club detail page to fetch and display roster data with Material styling.

## Immediate next steps
- Run the frontend unit suite once a headless Chrome binary is available (`npm test -- --watch=false --progress=false --browsers=ChromeHeadless`).
- Continue profile management UI work backed by `/api/profile` (view/update, password change, platform selection) with optimistic UI states.
