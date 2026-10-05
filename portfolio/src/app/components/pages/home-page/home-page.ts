import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { AppLanguage } from '@common/enums/app-language.enum';
import { ARRIVED_FROM_HOME_STATE } from '../../../services/app-state';
import { LanguageService } from '../../../services/language';
import { LanguageSwitcher } from '../../shared/language-switcher/language-switcher';

@Component({
  selector: 'app-home-page',
  imports: [LanguageSwitcher, TranslatePipe],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  // Matches home-page.scss: elements leave over 0.84s, then the background
  // fades out until 1.3s.
  static readonly EXIT_DURATION_MS = 1300;

  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private exitTimer: ReturnType<typeof setTimeout> | undefined;

  readonly isLeaving = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.exitTimer));
  }

  leaveWithLanguage(language: AppLanguage): void {
    if (this.isLeaving()) {
      return;
    }

    if (this.prefersReducedMotion()) {
      this.openExperiences(language);
      return;
    }

    this.isLeaving.set(true);
    this.exitTimer = setTimeout(
      () => this.openExperiences(language),
      HomePage.EXIT_DURATION_MS
    );
  }

  // The language switches only now, so the text does not change mid-exit.
  private openExperiences(language: AppLanguage): void {
    this.languageService.setLanguage(language);
    void this.router.navigate(['/', language, 'experiences'], {
      state: { [ARRIVED_FROM_HOME_STATE]: true }
    });
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
