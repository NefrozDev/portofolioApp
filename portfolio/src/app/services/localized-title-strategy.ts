import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { I18nService } from './i18n';

@Injectable({
  providedIn: 'root'
})
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18nService = inject(I18nService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot);

    if (!titleKey) {
      return;
    }

    const pageTitle = this.i18nService.instant(titleKey);
    const appName = this.i18nService.instant('home.name');

    this.title.setTitle(`${pageTitle} | ${appName}`);
  }
}
