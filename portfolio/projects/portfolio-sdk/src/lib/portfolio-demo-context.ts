import { DOCUMENT } from '@angular/common';
import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  signal
} from '@angular/core';

import {
  AppLanguage,
  PortfolioDemoContext,
  PortfolioTheme
} from '@portfolio/contracts';

export interface PortfolioSdkConfig {
  projectId: string;
  portfolioUrl: string;
  apiBaseUrl: string;
  defaultLanguage?: AppLanguage;
  defaultTheme?: PortfolioTheme;
}

export const PORTFOLIO_SDK_CONFIG = new InjectionToken<PortfolioSdkConfig>(
  'PORTFOLIO_SDK_CONFIG'
);

export function providePortfolioSdk(
  config: PortfolioSdkConfig
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: PORTFOLIO_SDK_CONFIG, useValue: config },
    PortfolioDemoContextService
  ]);
}

@Injectable()
export class PortfolioDemoContextService {
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(PORTFOLIO_SDK_CONFIG);

  readonly context = signal(
    resolvePortfolioDemoContext(
      this.document.defaultView?.location.href ?? this.config.portfolioUrl,
      this.config
    )
  );

  buildApiUrl(path: string): string {
    const baseUrl = this.config.apiBaseUrl.endsWith('/')
      ? this.config.apiBaseUrl
      : `${this.config.apiBaseUrl}/`;

    return new URL(path.replace(/^\//, ''), baseUrl).toString();
  }
}

export function resolvePortfolioDemoContext(
  currentUrl: string,
  config: PortfolioSdkConfig
): PortfolioDemoContext {
  const url = new URL(currentUrl, config.portfolioUrl);
  const language = toSupportedLanguage(
    url.searchParams.get('lang'),
    config.defaultLanguage ?? AppLanguage.EN
  );
  const theme = toSupportedTheme(
    url.searchParams.get('theme'),
    config.defaultTheme ?? 'dark'
  );

  return {
    projectId: config.projectId,
    language,
    theme,
    returnUrl: toSafeReturnUrl(
      url.searchParams.get('returnUrl'),
      config.portfolioUrl
    )
  };
}

function toSupportedLanguage(
  language: string | null,
  fallback: AppLanguage
): AppLanguage {
  return Object.values(AppLanguage).includes(language as AppLanguage)
    ? (language as AppLanguage)
    : fallback;
}

function toSupportedTheme(
  theme: string | null,
  fallback: PortfolioTheme
): PortfolioTheme {
  return theme === 'light' || theme === 'dark' ? theme : fallback;
}

function toSafeReturnUrl(returnUrl: string | null, portfolioUrl: string): string {
  const fallbackUrl = new URL(portfolioUrl);

  if (!returnUrl) {
    return fallbackUrl.toString();
  }

  const candidateUrl = new URL(returnUrl, fallbackUrl);

  return candidateUrl.origin === fallbackUrl.origin
    ? candidateUrl.toString()
    : fallbackUrl.toString();
}
