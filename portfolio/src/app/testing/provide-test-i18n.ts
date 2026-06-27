import { ENVIRONMENT_INITIALIZER, Provider, inject } from '@angular/core';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';

import { AppLanguage } from '@common/enums/app-language.enum';
import { APP_TRANSLATIONS } from '@common/i18n';

export function provideTestI18n(): Provider[] {
  return [
    ...provideTranslateService({
      fallbackLang: AppLanguage.EN,
      lang: AppLanguage.EN
    }),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const translateService = inject(TranslateService);
        const languages = Object.values(AppLanguage);

        translateService.addLangs(languages);

        languages.forEach((language) => {
          translateService.setTranslation(language, APP_TRANSLATIONS[language]);
        });

        translateService.use(AppLanguage.EN).subscribe();
      }
    }
  ];
}
