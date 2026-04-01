import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AppLanguage } from '../../../../../../Common/enums/app-language.enum';
import { NAVIGATION_ITEMS } from '../../../../../../Common/constants/navigation-items';
import { LANGUAGE_OPTIONS } from '../../../../../../Common/constants/language-options';
import { NavItem } from '../../../../../../Common/models/nav-item.model';
import { LanguageOption } from '../../../../../../Common/models/language.model';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './site-header.html',
  styleUrls: ['./site-header.scss']
})
export class SiteHeader {
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);

  readonly navigationItems: NavItem[] = NAVIGATION_ITEMS;
  readonly languages: LanguageOption[] = LANGUAGE_OPTIONS; // ✅ added
  readonly AppLanguage = AppLanguage; // (optional, not needed anymore but ok to keep)

  readonly currentLanguage = computed(() =>
    this.languageService.currentLanguage()
  );

  getLink(route: string): string[] {
    const lang = this.currentLanguage();

    if (!route) {
      return ['/', lang];
    }

    return ['/', lang, route];
  }

  changeLanguage(language: AppLanguage): void {
    if (!language) {
      console.warn('SiteHeader: langue vide ignorée.');
      return;
    }

    this.languageService.setLanguage(language);

    const currentUrl = this.router.url;
    const segments = currentUrl.split('/').filter(Boolean);

    if (!segments.length) {
      void this.router.navigate(['/', language]);
      return;
    }

    const supportedLanguages = Object.values(AppLanguage);

    if (supportedLanguages.includes(segments[0] as AppLanguage)) {
      segments[0] = language;
      void this.router.navigate(['/', ...segments]);
      return;
    }

    void this.router.navigate(['/', language, ...segments]);
  }
}