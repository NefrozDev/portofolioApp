import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePortfolioSdk } from 'portfolio-sdk';

import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    providePortfolioSdk({
      projectId: 'demo-template',
      portfolioUrl: environment.portfolioUrl,
      apiBaseUrl: environment.apiBaseUrl
    })
  ]
};
