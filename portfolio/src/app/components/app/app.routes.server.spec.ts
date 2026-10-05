import { RenderMode } from '@angular/ssr';

import { AppLanguage } from '@common/enums/app-language.enum';
import { routes } from './app.routes';
import { serverRoutes } from './app.routes.server';

describe('serverRoutes', () => {
  it('should prerender every language-prefixed page', () => {
    const languageRoute = routes.find((route) => route.path === ':lang');
    const pagePaths = (languageRoute?.children ?? []).map((route) =>
      route.path ? `:lang/${route.path}` : ':lang'
    );
    const prerenderedPaths = serverRoutes
      .filter((route) => route.renderMode === RenderMode.Prerender)
      .map((route) => route.path);

    expect(prerenderedPaths).toEqual(pagePaths);
  });

  it('should prerender each page in every supported language', async () => {
    const prerenderedRoutes = serverRoutes.filter(
      (route) => route.renderMode === RenderMode.Prerender
    );

    for (const route of prerenderedRoutes) {
      const params = 'getPrerenderParams' in route
        ? await route.getPrerenderParams()
        : undefined;

      expect(params).toEqual(Object.values(AppLanguage).map((lang) => ({ lang })));
    }
  });

  it('should render the root and unknown paths in the browser so they can redirect to the preferred language', () => {
    expect(serverRoutes.at(-1)).toEqual({ path: '**', renderMode: RenderMode.Client });
  });
});
