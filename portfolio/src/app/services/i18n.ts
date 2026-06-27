import { Injectable, effect, inject } from '@angular/core';
import {
  TranslateService,
  type InterpolationParameters,
  type Translation,
  type TranslationObject
} from '@ngx-translate/core';
import { Observable, map, take } from 'rxjs';

import { LANGUAGE_OPTIONS } from '@common/constants/language-options';
import { AppLanguage } from '@common/enums/app-language.enum';
import { LanguageService } from './language';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private readonly translateService = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  readonly currentLanguage = this.languageService.currentLanguage;
  readonly isLoading = this.translateService.isLoading;
  readonly supportedLanguages = LANGUAGE_OPTIONS.map((language) => language.code);

  constructor() {
    this.translateService.addLangs(this.supportedLanguages);
    this.activateLanguage(this.languageService.getLanguage());

    effect(() => {
      this.activateLanguage(this.currentLanguage());
    });
  }

  useLanguage(language: AppLanguage): void {
    if (!this.isSupportedLanguage(language)) {
      console.warn('I18nService: unsupported language ignored.', language);
      return;
    }

    this.languageService.setLanguage(language);
    this.activateLanguage(language);
  }

  setTranslations(
    language: AppLanguage,
    translations: TranslationObject,
    shouldMerge = true
  ): void {
    this.translateService.setTranslation(language, translations, shouldMerge);
  }

  instant(key: string, params?: InterpolationParameters): string {
    return this.toText(this.translateService.instant(key, params), key);
  }

  get(key: string, params?: InterpolationParameters): Observable<string> {
    return this.translateService
      .get(key, params)
      .pipe(map((translation) => this.toText(translation, key)));
  }

  stream(key: string, params?: InterpolationParameters): Observable<string> {
    return this.translateService
      .stream(key, params)
      .pipe(map((translation) => this.toText(translation, key)));
  }

  private activateLanguage(language: AppLanguage): void {
    if (this.translateService.getCurrentLang() === language) {
      return;
    }

    this.translateService.use(language).pipe(take(1)).subscribe({
      error: (error) => {
        console.error('I18nService: failed to activate language.', error);
      }
    });
  }

  private isSupportedLanguage(language: string): language is AppLanguage {
    return this.supportedLanguages.includes(language as AppLanguage);
  }

  private toText(translation: Translation, fallback: string): string {
    return typeof translation === 'string' ? translation : fallback;
  }
}
