import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NAVIGATION_ITEMS } from '../../../../../../Common/constants/navigation-items';
import { NavItem } from '../../../../../../Common/models/nav-item.model';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-mobile-bottom-nav',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './mobile-bottom-nav.html',
  styleUrl: './mobile-bottom-nav.scss'
})
export class MobileBottomNav {
  private readonly languageService = inject(LanguageService);

  readonly navigationItems: NavItem[] = NAVIGATION_ITEMS;
  readonly currentLanguage = computed(() => this.languageService.currentLanguage());

  getLink(route: string): string[] {
    return route
      ? ['/', this.currentLanguage(), route]
      : ['/', this.currentLanguage()];
  }
}
