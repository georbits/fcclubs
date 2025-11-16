# Frontend Plan

The Angular SPA will use the following structure:

- `app/core`: Authentication service (OAuth2 code flow), API client, guards, and shared models.
- `app/features/public`: Home (standings), registration, and club detail pages.
- `app/features/private`: Profile settings, club management dashboard, result submission wizard, and admin-only league builder.
- `app/shared`: UI components (tables, cards, form controls) styled with Angular Material and Tailwind CSS.

Initial milestones:
1. Bootstrap Angular workspace with routing, state management (NgRx), and global theming.
2. Implement public pages backed by mocked API responses.
3. Integrate OAuth2 login and secure private routes.
4. Wire profile management forms to backend endpoints.
5. Deliver club manager workflows (roster management, match result forms) followed by admin league controls.
