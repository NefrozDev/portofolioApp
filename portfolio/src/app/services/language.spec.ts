import { TestBed } from '@angular/core/testing';

import { AppLanguage } from '@common/enums/app-language.enum';
import { LanguageService } from './language';

describe('LanguageService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
  });

  function useBrowserLanguages(languages: string[]): void {
    spyOnProperty(navigator, 'languages').and.returnValue(languages);
  }

  it('should be created', () => {
    expect(TestBed.inject(LanguageService)).toBeTruthy();
  });

  it('should prefer the saved language over the browser language', () => {
    localStorage.setItem('portfolio-language', AppLanguage.NL);
    useBrowserLanguages(['fr-BE']);

    expect(TestBed.inject(LanguageService).getLanguage()).toBe(AppLanguage.NL);
  });

  it('should use the first supported browser language when nothing is saved', () => {
    useBrowserLanguages(['pt-BR', 'de-CH', 'fr']);

    expect(TestBed.inject(LanguageService).getLanguage()).toBe(AppLanguage.DE);
  });

  it('should ignore an unsupported saved language', () => {
    spyOn(console, 'warn');
    localStorage.setItem('portfolio-language', 'xx');
    useBrowserLanguages(['es-ES']);

    expect(TestBed.inject(LanguageService).getLanguage()).toBe(AppLanguage.ES);
  });

  it('should fall back to English when no browser language is supported', () => {
    useBrowserLanguages(['pt-BR', 'ja']);

    expect(TestBed.inject(LanguageService).getLanguage()).toBe(AppLanguage.EN);
  });

  it('should save the selected language', () => {
    const service = TestBed.inject(LanguageService);

    service.setLanguage(AppLanguage.IT);

    expect(service.getLanguage()).toBe(AppLanguage.IT);
    expect(localStorage.getItem('portfolio-language')).toBe(AppLanguage.IT);
  });
});
