# FC26 Pro Clubs SPA

Angular standalone application styled with Angular Material and Tailwind, using NgRx for state scaffolding. Public routes surface standings, registration, and club details while private areas host profile, club management, and match reporting workflows.

## Prerequisites
- Node.js 20+
- npm 10+

## Getting started
```bash
npm install
npm start # alias for ng serve --open
```
The dev server runs at http://localhost:4200 and auto-reloads on file changes.

Key scripts:
- `npm start` – serve the app locally.
- `npm run build` – production build to `dist/`.
- `npm test` – run unit tests with Karma.

## Project structure
```
frontend/
  src/app/
    core/            # auth guard/service, global state wiring
    features/
      public/        # home/standings, registration, club detail stubs
      private/       # profile, club manager, and match reporting stubs
    shared/          # shared UI/helpers (to be filled as features land)
  src/styles.scss    # Tailwind + Material theme foundation
```

## Tech choices
- **Angular Material** for layout primitives (toolbar, cards, buttons) with a custom cyan/deep-purple theme.
- **Tailwind CSS** for utility styling and spacing; see `tailwind.config.js` and `postcss.config.js`.
- **NgRx** store/effects/router-store/devtools registered in `app.config.ts` to support future API integration.

## Next steps
- Wire OAuth2 login to replace the placeholder `AuthService`/guard logic.
- Connect public routes to backend standings and club APIs.
- Build forms for registration, profile updates, roster management, and result submission.
