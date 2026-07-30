import { languageGuard } from '../../guards/language.guard';
import { routes } from './app.routes';

describe('routes', () => {
  it('should redirect the empty path to English', () => {
    expect(routes[0]).toEqual(
      jasmine.objectContaining({
        path: '',
        pathMatch: 'full',
        redirectTo: 'en'
      })
    );
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

  it('should redirect unknown paths to English', () => {
    expect(routes.at(-1)).toEqual(
      jasmine.objectContaining({
        path: '**',
        redirectTo: 'en'
      })
    );
  });
});
