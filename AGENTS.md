# Agent Handoff Notes

This repository currently tracks both the Spring Boot backend and Angular frontend for the FC26 Pro Clubs Tournament platform. Use these notes as the starting point for the next task.

## Next steps (proposed backlog)
1. **Frontend authentication wiring**: add real OAuth2/OIDC login + token storage, replace the placeholder auth service/guard, and ensure API calls include credentials (consider a dev proxy for the backend).
2. **Public registration flow**: build the registration page UI to call `/api/auth/register`, handle validation/errors, and add a success path/redirect.
3. **Profile management UI**: implement the profile page form(s) backed by `/api/profile` (view + update, including password change and platform selection) with optimistic UI states.
4. **Club management UI**: surface club roster management for managers/admins (list players, add/remove player interactions) hitting `/api/clubs/{id}/players` endpoints; reuse standings styling for tables.
5. **Result reporting UI**: implement the match result submission page to post scores to `/api/matches/{id}/result`, with permission-aware messaging and duplicate-submission handling.
6. **Public club detail page**: fetch and display club info (logo/name/roster/recent results) once backend endpoints exist or are stubbed.
7. **Styling/testing**: expand Tailwind/Material theming, add component/unit tests where practical, and re-run `npm test -- --watch=false --browsers=ChromeHeadless --progress=false` once Chrome is available.

## Environment reminders
- No remotes are configured in this sandbox; create/update branches locally unless a remote is added.
- Backend Maven tests (`mvn test`) should now work with network access; run them before backend changes.
- Avoid committing binary assets; prefer SVG or text-based alternatives.

## Recent progress
- Public registration page now uses a reactive form that posts to `/auth/register`, includes platform selection, validation, and submission/error states, and has accompanying unit tests (ChromeHeadless currently unavailable in this environment).

## Immediate next steps
- Run the frontend unit suite once a headless Chrome binary is available (`npm test -- --watch=false --progress=false --browsers=ChromeHeadless`).
- Wire up real OAuth2/OIDC login + token storage in the auth service/guard and ensure API calls include credentials (a dev proxy to the backend may be needed).
- Continue profile management UI work backed by `/api/profile` (view/update, password change, platform selection) with optimistic UI states.
