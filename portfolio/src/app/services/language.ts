import { Injectable, signal } from '@angular/core';
import { AppLanguage } from '../../../../Common/enums/app-language.enum';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly storageKey = 'portfolio-language';

  readonly currentLanguage = signal<AppLanguage>(this.getInitialLanguage());

  setLanguage(language: AppLanguage): void {
    if (!language) {
      console.warn('LanguageService: empty language ignored.');
      return;
    }

    if (this.currentLanguage() === language) {
      return;
    }

    this.currentLanguage.set(language);

    try {
      localStorage.setItem(this.storageKey, language);
    } catch (error) {
      console.error(
        'LanguageService: failed to write to localStorage.',
        error
      );
    }
  }

  getLanguage(): AppLanguage {
    return this.currentLanguage();
  }

  private getInitialLanguage(): AppLanguage {
    return this.getStoredLanguage() ?? this.getBrowserLanguage() ?? AppLanguage.EN;
  }

  private getStoredLanguage(): AppLanguage | undefined {
    try {
      const storedLanguage = localStorage.getItem(this.storageKey);

      if (!storedLanguage) {
        return undefined;
      }

      if (!this.isSupportedLanguage(storedLanguage)) {
        console.warn(
          'LanguageService: unsupported stored language ignored.'
        );
        return undefined;
      }

      return storedLanguage;
    } catch (error) {
      console.error(
        'LanguageService: failed to read from localStorage.',
        error
      );
      return undefined;
    }
  }

  // Picks the first browser language we support, e.g. "fr-BE" gives "fr".
  private getBrowserLanguage(): AppLanguage | undefined {
    const browserLanguages = globalThis.navigator?.languages ?? [];

    return browserLanguages
      .map((language) => language.toLowerCase().split('-')[0])
      .find((language): language is AppLanguage => this.isSupportedLanguage(language));
  }

  private isSupportedLanguage(language: string): language is AppLanguage {
    return Object.values(AppLanguage).includes(language as AppLanguage);
  }
}
