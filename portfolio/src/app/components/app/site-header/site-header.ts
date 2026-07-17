import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppLanguage } from '../../../../../../Common/enums/app-language.enum';
import { NAVIGATION_ITEMS } from '../../../../../../Common/constants/navigation-items';
import { LANGUAGE_OPTIONS } from '../../../../../../Common/constants/language-options';
import { NavItem } from '../../../../../../Common/models/nav-item.model';
import { LanguageOption } from '../../../../../../Common/models/language.model';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './site-header.html',
  styleUrls: ['./site-header.scss']
})
export class SiteHeader {
  private readonly router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly navigationItems: NavItem[] = NAVIGATION_ITEMS;
  readonly languages: LanguageOption[] = LANGUAGE_OPTIONS;
  readonly isLanguageMenuOpen = signal(false);

  readonly currentLanguage = computed(() =>
    this.languageService.currentLanguage()
  );

  toggleLanguageMenu(): void {
    this.isLanguageMenuOpen.update((isOpen) => !isOpen);
  }

  closeLanguageMenu(): void {
    this.isLanguageMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event.target'])
  closeLanguageMenuOnOutsideClick(target: EventTarget | null): void {
    if (
      this.isLanguageMenuOpen() &&
      target instanceof Node &&
      !this.elementRef.nativeElement.contains(target)
    ) {
      this.closeLanguageMenu();
    }
  }

  @HostListener('document:keydown.escape')
  closeLanguageMenuOnEscape(): void {
    this.closeLanguageMenu();
  }

  getLink(route: string): string[] {
    const lang = this.currentLanguage();

    if (!route) {
      return ['/', lang];
    }

    return ['/', lang, route];
  }

  changeLanguage(language: AppLanguage): void {
    if (!language) {
      console.warn('SiteHeader: empty language ignored.');
      return;
    }

    this.closeLanguageMenu();
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
