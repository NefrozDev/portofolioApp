# AGENTS.md

Instructions for AI coding agents working in this repository.

## Repository Layout

- `portfolio/` is the Angular frontend application.
- `Backend/` is the Express/TypeScript backend API.
- `Common/` contains shared TypeScript models, enums, constants, and exports used across the project.
- Root `package.json` provides convenience scripts for frontend and backend tasks.

## Architecture

### Frontend

- The frontend uses a standalone Angular application architecture.
- `portfolio/src/main.ts` bootstraps `AppComponent` with `appConfig`; there is no Angular NgModule root.
- `portfolio/src/app/components/app/app.ts` is the application shell and composes persistent layout pieces such as the site header, mobile bottom navigation, and `RouterOutlet`.
- Routing is centralized in `portfolio/src/app/components/app/app.routes.ts`.
- Routes are language-prefixed with `/:lang`, protected by `languageGuard`, and page components are lazy-loaded with `loadComponent`.
- Page-level components belong in `portfolio/src/app/components/pages/`.
- Reusable UI and display components belong in `portfolio/src/app/components/shared/`.
- Cross-cutting frontend behavior belongs in `services/`, `guards/`, and `pipes/`.
- API access is handled through injectable Angular services under `portfolio/src/app/services/api/`.
- Shared contracts should come from `Common/`, preferably through the configured `@common/*` TypeScript path alias.

### Backend

- The backend uses a modular Express API architecture written in TypeScript.
- `Backend/app.ts` creates and configures the Express app, including middleware and route mounting.
- `Backend/src/server.ts` is the runtime entry point and only starts the HTTP listener.
- API routes are mounted under `/api/*` and implemented as focused routers in `Backend/src/routes/`.
- Keep route files responsible for HTTP request/response behavior; move reusable domain, data, or validation logic out when it grows.
- Environment configuration belongs in `Backend/config/`.
- Static or seed-like backend data belongs in `Backend/data/`.
- Backend route tests live next to the route modules using the existing `.spec.ts` pattern.
- Backend DTOs and response shapes should use shared models from `Common/` when they are also consumed by the frontend.

## Common Commands

Run commands from the repository root unless noted otherwise.

- Frontend development server: `npm run start:front`
- Frontend build: `npm run build:front`
- Frontend tests: `npm run test:front`
- Backend development server: `npm run start:back`
- Backend build: `npm run build:back`
- Backend tests: `npm run test:back`
- Build frontend and backend: `npm run build`
- Test frontend and backend: `npm test`

When working inside a subproject directly:

- Frontend: use `npm --prefix portfolio run <script>`
- Backend: use `npm --prefix Backend run <script>`

## Coding Guidelines

- Keep changes scoped to the requested area and avoid unrelated refactors.
- Preserve the existing TypeScript style and file organization.
- Prefer updating or adding focused tests near the code being changed.
- When building or changing code, add or update the matching unit tests in the relevant `.spec.ts` file as part of the same change.
- Do not edit generated build output, dependency folders, or lockfiles unless the task requires it.
- Be careful with shared code in `Common/`; changes there can affect both frontend and backend behavior.

## Frontend Notes

- The frontend uses Angular 20 with SCSS.
- Components live under `portfolio/src/app/components/`.
- Shared UI components live under `portfolio/src/app/components/shared/`.
- Page components live under `portfolio/src/app/components/pages/`.
- Services, guards, and pipes each have their own folders under `portfolio/src/app/`.
- Keep templates, styles, specs, and component TypeScript files together using the existing naming pattern.

## Backend Notes

- The backend uses Express with TypeScript.
- API route handlers live under `Backend/src/routes/`.
- Static or seed-like data lives under `Backend/data/`.
- Server setup is split between `Backend/app.ts` and `Backend/src/server.ts`.
- Keep backend tests next to the route or module they cover using the existing `.spec.ts` pattern.

## Shared Code Notes

- Shared public exports should be maintained through `Common/index.ts`.
- Keep shared models and enums framework-agnostic.
- Avoid importing Angular or Express-specific code into `Common/`.
