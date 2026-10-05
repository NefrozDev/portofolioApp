import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { I18nService } from './i18n';
import { PageMetaService } from './page-meta';

@Injectable({
  providedIn: 'root'
})
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly i18nService = inject(I18nService);
  private readonly pageMeta = inject(PageMetaService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot);

    if (!titleKey) {
      return;
    }

    const pageTitle = this.i18nService.instant(titleKey);
    const appName = this.i18nService.instant('home.name');

    const fullTitle = `${pageTitle} | ${appName}`;

    this.title.setTitle(fullTitle);
    this.pageMeta.update(fullTitle, this.getDescriptionKey(snapshot), snapshot.url);
  }

  private getDescriptionKey(snapshot: RouterStateSnapshot): string | undefined {
    let route = snapshot.root;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    return route?.data['description'];
  }
}
