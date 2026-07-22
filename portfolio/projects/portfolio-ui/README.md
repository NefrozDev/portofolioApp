# portfolio-ui

Shared Angular presentation primitives for independently built portfolio demos.

## Public API

- `DemoShell`: common glass/indigo layout with a configurable portfolio return link.

Only components that are useful to more than one application belong here. App-specific screens stay inside their demo application.

Build from `portfolio/` with:

```bash
ng build portfolio-ui
```
