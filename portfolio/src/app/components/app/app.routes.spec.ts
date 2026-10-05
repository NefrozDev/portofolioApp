import { TestBed } from '@angular/core/testing';

import { AppLanguage } from '@common/enums/app-language.enum';
import { languageGuard } from '../../guards/language.guard';
import { LanguageService } from '../../services/language';
import { redirectToPreferredLanguage, routes } from './app.routes';

describe('routes', () => {
  it('should redirect the empty path and unknown paths to the preferred language', () => {
    expect(routes[0]).toEqual(
      jasmine.objectContaining({
        path: '',
        pathMatch: 'full',
        redirectTo: redirectToPreferredLanguage
      })
    );
    expect(routes[routes.length - 1]).toEqual(
      jasmine.objectContaining({
        path: '**',
        redirectTo: redirectToPreferredLanguage
      })
    );
  });

  it('should resolve the preferred language from the language service', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: LanguageService, useValue: { getLanguage: () => AppLanguage.NL } }
      ]
    });

    expect(TestBed.runInInjectionContext(redirectToPreferredLanguage)).toBe(AppLanguage.NL);
  });

  it('should protect language-prefixed routes with the language guard', () => {
    const languageRoute = routes.find((route) => route.path === ':lang');

    expect(languageRoute?.canActivate).toContain(languageGuard);
    expect(languageRoute?.children?.map((route) => route.path)).toEqual([
      '',
      'experiences',
      'projects',
      'contact'
    ]);
  });

  it('should use translation keys for page titles', () => {
    const languageRoute = routes.find((route) => route.path === ':lang');

    expect(languageRoute?.children?.map((route) => route.title)).toEqual([
      'app.navigation.home',
      'app.navigation.experiences',
      'app.navigation.projects',
      'app.navigation.contact'
    ]);
  });

  it('should give every page a localized description for search engines', () => {
    const languageRoute = routes.find((route) => route.path === ':lang');

    expect(languageRoute?.children?.map((route) => route.data?.['description'])).toEqual([
      'app.seo.home',
      'app.seo.experiences',
      'app.seo.projects',
      'app.seo.contact'
    ]);
  });

  it('should lazy-load every page component', async () => {
    const languageRoute = routes.find((route) => route.path === ':lang');
    const loadedComponents = await Promise.all(
      (languageRoute?.children ?? []).map((route) => route.loadComponent?.())
    );

    expect(
      loadedComponents.map(
        (component) =>
          (
            component as
              | { ɵcmp?: { selectors?: string[][] } }
              | undefined
          )?.ɵcmp?.selectors?.[0]?.[0]
      )
    ).toEqual([
      'app-home-page',
      'app-experiences-page',
      'app-projects-page',
      'app-contact-page'
    ]);
  });
});
