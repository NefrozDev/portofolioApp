# Portfolio project architecture

The repository is an Angular multi-project workspace inside a single Git repository.

```text
Common (@portfolio/contracts)
          |
          v
portfolio-sdk ---------> demo applications
portfolio-ui ----------> demo applications
                              |
portfolio shell -------------+ (URL context and Backend API)
```

## Responsibilities

### `Common/`

Framework-agnostic contracts shared by frontend packages and the Backend. The package entry point for new applications is `@portfolio/contracts`; the existing `@common/*` source aliases remain available to the shell and Backend during migration.

### `portfolio-ui`

Reusable Angular presentation only: shells, buttons, cards and theme primitives that are genuinely shared by multiple demos. It must not know about a specific project's domain.

### `portfolio-sdk`

The runtime bridge between a demo and the portfolio ecosystem. It owns URL context parsing, safe return navigation and API URL construction. Demo applications must not import services directly from the main shell because separately built applications do not share Angular dependency-injection memory.

### Demo applications

Each folder under `portfolio/projects/<demo-name>` is independently buildable, testable and deployable. Domain components and state stay inside that application.

## Runtime context

The shell opens a demo with explicit context:

```text
/demos/robot-dashboard/?lang=fr&theme=dark&returnUrl=/fr/projects
```

The SDK exposes a `PortfolioDemoContext` containing:

- `projectId`
- `language`
- `theme`
- validated `returnUrl`

Shared mutable data should come from the Backend API. URL parameters are for small navigation/display context, not application data.

## Creating a project

From `portfolio/`:

```bash
ng generate application robot-dashboard --routing --style=scss
```

Then:

1. Add `providePortfolioSdk(...)` to the new app configuration.
2. Use `DemoShell` at the application root.
3. Add development and production environment URLs.
4. Set the production `baseHref` to `/demos/robot-dashboard/` in `angular.json`.
5. Add the app to `build:projects` and `test:projects` in `portfolio/package.json`.
6. Add `demoAppId` and `demoUrl` to its `Project` metadata.

Use `demo-template` as the working reference rather than copying its Angular project configuration verbatim.

## Build order

Libraries are package boundaries, so contracts and libraries build before demo applications:

```bash
npm --prefix portfolio run build:projects
```

The root commands include the shell, demos and Backend:

```bash
npm run build
npm test
```

Production artifacts are emitted separately under `portfolio/dist/`. A deployment workflow can copy the shell to the site root and each demo to its configured `/demos/<name>/` directory.
