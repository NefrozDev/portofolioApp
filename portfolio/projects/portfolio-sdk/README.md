# portfolio-sdk

Runtime bridge shared by portfolio demos.

`providePortfolioSdk` configures the portfolio URL, API URL and project id. `PortfolioDemoContextService` safely reads `lang`, `theme` and `returnUrl` from the demo URL and builds API URLs.

The SDK depends on the framework-agnostic `@portfolio/contracts` package. Build from `portfolio/` with:

```bash
npm run build:contracts
ng build portfolio-sdk
```
