import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { AppLanguage } from '../../../../Common/enums/app-language.enum';
import { LanguageService } from '../services/language';

export const languageGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | UrlTree => {
  const router = inject(Router);
  const languageService = inject(LanguageService);

  const langParam = route.paramMap.get('lang');

  if (!langParam) {
    console.warn('languageGuard: paramètre lang manquant.');
    return router.createUrlTree(['/en']);
  }

  const supportedLanguages = Object.values(AppLanguage);

  if (!supportedLanguages.includes(langParam as AppLanguage)) {
    console.warn(
      'languageGuard: langue non supportée détectée, redirection vers EN.'
    );

    const sanitizedUrl = sanitizeUrlWithoutInvalidLang(state.url);
    return router.createUrlTree(['/en', ...sanitizedUrl]);
  }

  languageService.setLanguage(langParam as AppLanguage);
  return true;
};

function sanitizeUrlWithoutInvalidLang(url: string): string[] {
  const segments = url.split('/').filter(Boolean);

  if (!segments.length) {
    return [];
  }

  return segments.slice(1);
}