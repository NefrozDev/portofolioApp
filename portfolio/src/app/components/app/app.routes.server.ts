import { RenderMode, ServerRoute } from '@angular/ssr';

import { AppLanguage } from '@common/enums/app-language.enum';

const prerenderedPagePaths = [':lang', ':lang/experiences', ':lang/projects', ':lang/contact'];

// Every page is generated at build time in every language, so search
// engines and link previews get the full page content. The root and
// unknown paths stay client-side because they redirect to the visitor's
// preferred language.
export const serverRoutes: ServerRoute[] = [
  ...prerenderedPagePaths.map((path): ServerRoute => ({
    path,
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () =>
      Object.values(AppLanguage).map((lang) => ({ lang }))
  })),
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
