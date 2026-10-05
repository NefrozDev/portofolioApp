import {
  ApplicationConfig,
  ENVIRONMENT_INITIALIZER,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, TitleStrategy } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

import { AppLanguage } from '@common/enums/app-language.enum';
import { I18nService } from '../../services/i18n';
import { LocalizedTitleStrategy } from '../../services/localized-title-strategy';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // Reuses the prerendered page and the API data it was built with.
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    ...provideTranslateService({
      fallbackLang: AppLanguage.EN,
      lang: AppLanguage.EN
    }),
    { provide: TitleStrategy, useClass: LocalizedTitleStrategy },
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        inject(I18nService);
      }
    }
  ]
};
