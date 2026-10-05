import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

import { AppLanguage } from '@common/enums/app-language.enum';
import { environment } from '../../environments/environment';
import { I18nService } from './i18n';

/**
 * Keeps the description, link-preview (Open Graph / Twitter) tags,
 * canonical URL and language alternates in sync with the current page,
 * so search engines and shared links describe each page correctly.
 */
@Injectable({
  providedIn: 'root'
})
export class PageMetaService {
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly i18nService = inject(I18nService);

  update(pageTitle: string, descriptionKey: string | undefined, url: string): void {
    const path = url.split(/[?#]/)[0] || '/';
    const pageUrl = `${environment.siteUrl}${path}`;
    const description = descriptionKey
      ? this.i18nService.instant(descriptionKey, {
          name: this.i18nService.instant('home.name'),
          position: this.i18nService.instant('home.position')
        })
      : '';

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.i18nService.instant('home.name') });
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:image', content: `${environment.siteUrl}/img/userpic.png` });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });

    this.setLink('canonical', pageUrl);
    this.setLanguageAlternates(path);
  }

  // Points search engines to the same page in every supported language.
  private setLanguageAlternates(path: string): void {
    const pageSegments = path.split('/').filter(Boolean).slice(1);
    const languageUrl = (language: AppLanguage) =>
      `${environment.siteUrl}/${[language, ...pageSegments].join('/')}`;

    this.document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((link) => link.remove());

    Object.values(AppLanguage).forEach((language) => {
      this.appendLink('alternate', languageUrl(language), language);
    });
    this.appendLink('alternate', languageUrl(AppLanguage.EN), 'x-default');
  }

  private setLink(rel: string, href: string): void {
    const link = this.document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

    if (link) {
      link.setAttribute('href', href);
      return;
    }

    this.appendLink(rel, href);
  }

  private appendLink(rel: string, href: string, hreflang?: string): void {
    const link = this.document.createElement('link');
    link.setAttribute('rel', rel);
    link.setAttribute('href', href);

    if (hreflang) {
      link.setAttribute('hreflang', hreflang);
    }

    this.document.head.appendChild(link);
  }
}
