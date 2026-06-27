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
    try {
      const storedLanguage = localStorage.getItem(this.storageKey) as AppLanguage | null;

      if (!storedLanguage) {
        return AppLanguage.EN;
      }

      if (!this.isSupportedLanguage(storedLanguage)) {
        console.warn(
          'LanguageService: unsupported stored language, falling back to EN.'
        );
        return AppLanguage.EN;
      }

      return storedLanguage;
    } catch (error) {
      console.error(
        'LanguageService: failed to read from localStorage.',
        error
      );
      return AppLanguage.EN;
    }
  }

  private isSupportedLanguage(language: string): language is AppLanguage {
    return Object.values(AppLanguage).includes(language as AppLanguage);
  }
}
