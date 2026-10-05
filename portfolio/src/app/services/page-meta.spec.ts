import { TestBed } from '@angular/core/testing';
import { Meta } from '@angular/platform-browser';

import { AppLanguage } from '@common/enums/app-language.enum';
import { environment } from '../../environments/environment';
import { provideTestI18n } from '../testing/provide-test-i18n';
import { I18nService } from './i18n';
import { PageMetaService } from './page-meta';

describe('PageMetaService', () => {
  let service: PageMetaService;
  let meta: Meta;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideTestI18n()]
    });

    service = TestBed.inject(PageMetaService);
    meta = TestBed.inject(Meta);
  });

  afterEach(() => {
    document.head
      .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
      .forEach((link) => link.remove());
  });

  it('should describe the page with a localized description', () => {
    service.update('Projects | Steven De Moor', 'app.seo.projects', '/en/projects');

    const description = meta.getTag('name="description"')?.content;

    expect(description).toContain('Steven De Moor');
    expect(description).toContain('Full-Stack Software Engineer');
    expect(description).not.toContain('{{');
    expect(meta.getTag('property="og:description"')?.content).toBe(description);
    expect(meta.getTag('property="og:title"')?.content).toBe('Projects | Steven De Moor');
  });

  it('should use the active language for the description', () => {
    TestBed.inject(I18nService).useLanguage(AppLanguage.FR);

    service.update('Projets | Steven De Moor', 'app.seo.projects', '/fr/projects');

    expect(meta.getTag('name="description"')?.content).toMatch(/^Projets de Steven De Moor/);
  });

  it('should point the canonical URL and preview URL to the page without query string', () => {
    service.update('Contact | Steven De Moor', 'app.seo.contact', '/de/contact?ref=linkedin');

    const canonical = document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]');

    expect(canonical.length).toBe(1);
    expect(canonical[0].getAttribute('href')).toBe(`${environment.siteUrl}/de/contact`);
    expect(meta.getTag('property="og:url"')?.content).toBe(`${environment.siteUrl}/de/contact`);
  });

  it('should list the page once per language plus an English default', () => {
    service.update('Home', 'app.seo.home', '/nl');
    service.update('Experiences', 'app.seo.experiences', '/nl/experiences');

    const alternates = Array.from(
      document.head.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
    ).map((link) => [link.getAttribute('hreflang'), link.getAttribute('href')]);

    expect(alternates).toEqual([
      ...Object.values(AppLanguage).map((language) => [
        language,
        `${environment.siteUrl}/${language}/experiences`
      ]),
      ['x-default', `${environment.siteUrl}/en/experiences`]
    ]);
  });
});
