import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

import { AppLanguage } from '@common/enums/app-language.enum';
import { I18nService } from './i18n';
import { LanguageService } from './language';

describe('I18nService', () => {
  let service: I18nService;
  let languageService: LanguageService;
  let translateService: TranslateService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        ...provideTranslateService({
          fallbackLang: AppLanguage.EN,
          lang: AppLanguage.EN
        })
      ]
    });

    service = TestBed.inject(I18nService);
    languageService = TestBed.inject(LanguageService);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register supported app languages', () => {
    expect(translateService.getLangs()).toEqual([
      AppLanguage.EN,
      AppLanguage.FR,
      AppLanguage.NL,
      AppLanguage.ES,
      AppLanguage.IT,
      AppLanguage.DE
    ]);
  });

  it('should keep ngx-translate in sync when changing language through the i18n service', () => {
    service.useLanguage(AppLanguage.FR);

    expect(languageService.getLanguage()).toBe(AppLanguage.FR);
    expect(translateService.getCurrentLang()).toBe(AppLanguage.FR);
  });

  it('should return registered translations with interpolation', () => {
    service.setTranslations(AppLanguage.EN, {
      home: {
        greeting: 'Hello {{ name }}'
      }
    });

    expect(service.instant('home.greeting', { name: 'Steven' })).toBe('Hello Steven');
  });
});
