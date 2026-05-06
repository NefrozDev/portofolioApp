import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, convertToParamMap, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AppLanguage } from '../../../../Common/enums/app-language.enum';
import { LanguageService } from '../services/language';
import { languageGuard } from './language.guard';

describe('languageGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let languageService: jasmine.SpyObj<LanguageService>;

  beforeEach(() => {
    router = jasmine.createSpyObj<Router>('Router', ['createUrlTree']);
    languageService = jasmine.createSpyObj<LanguageService>('LanguageService', ['setLanguage']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: LanguageService, useValue: languageService }
      ]
    });
  });

  it('should allow supported languages and update the language service', () => {
    const result = runGuard('fr', '/fr/projects');

    expect(result).toBeTrue();
    expect(languageService.setLanguage).toHaveBeenCalledOnceWith(AppLanguage.FR);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to English when the language parameter is missing', () => {
    const redirected = {} as UrlTree;
    router.createUrlTree.and.returnValue(redirected);
    spyOn(console, 'warn');

    const result = runGuard(null, '/');

    expect(result).toBe(redirected);
    expect(router.createUrlTree).toHaveBeenCalledOnceWith(['/en']);
    expect(languageService.setLanguage).not.toHaveBeenCalled();
  });

  it('should redirect invalid languages while preserving the rest of the URL', () => {
    const redirected = {} as UrlTree;
    router.createUrlTree.and.returnValue(redirected);
    spyOn(console, 'warn');

    const result = runGuard('xx', '/xx/projects');

    expect(result).toBe(redirected);
    expect(router.createUrlTree).toHaveBeenCalledOnceWith(['/en', 'projects']);
    expect(languageService.setLanguage).not.toHaveBeenCalled();
  });
});

function runGuard(lang: string | null, url: string): boolean | UrlTree {
  const route = {
    paramMap: convertToParamMap(lang ? { lang } : {})
  } as ActivatedRouteSnapshot;
  const state = { url } as RouterStateSnapshot;

  return TestBed.runInInjectionContext(() => languageGuard(route, state)) as boolean | UrlTree;
}
