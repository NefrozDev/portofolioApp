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

  it('should redirect unknown paths to English', () => {
    expect(routes.at(-1)).toEqual(
      jasmine.objectContaining({
        path: '**',
        redirectTo: 'en'
      })
    );
  });
});
