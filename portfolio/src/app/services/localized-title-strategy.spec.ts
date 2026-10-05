import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';

import { I18nService } from './i18n';
import { LocalizedTitleStrategy } from './localized-title-strategy';
import { PageMetaService } from './page-meta';

describe('LocalizedTitleStrategy', () => {
  let strategy: LocalizedTitleStrategy;
  let title: jasmine.SpyObj<Title>;
  let i18nService: jasmine.SpyObj<I18nService>;
  let pageMeta: jasmine.SpyObj<PageMetaService>;

  beforeEach(() => {
    title = jasmine.createSpyObj<Title>('Title', ['setTitle']);
    i18nService = jasmine.createSpyObj<I18nService>('I18nService', ['instant']);
    pageMeta = jasmine.createSpyObj<PageMetaService>('PageMetaService', ['update']);

    TestBed.configureTestingModule({
      providers: [
        LocalizedTitleStrategy,
        { provide: Title, useValue: title },
        { provide: I18nService, useValue: i18nService },
        { provide: PageMetaService, useValue: pageMeta }
      ]
    });

    strategy = TestBed.inject(LocalizedTitleStrategy);
  });

  it('should combine the localized route title and application name', () => {
    spyOn(strategy, 'buildTitle').and.returnValue('app.navigation.projects');
    i18nService.instant.withArgs('app.navigation.projects').and.returnValue('Projects');
    i18nService.instant.withArgs('home.name').and.returnValue('Portfolio');

    strategy.updateTitle({} as RouterStateSnapshot);

    expect(title.setTitle).toHaveBeenCalledOnceWith('Projects | Portfolio');
  });

  it('should update the page meta tags with the deepest route description', () => {
    spyOn(strategy, 'buildTitle').and.returnValue('app.navigation.projects');
    i18nService.instant.withArgs('app.navigation.projects').and.returnValue('Projects');
    i18nService.instant.withArgs('home.name').and.returnValue('Portfolio');
    const snapshot = {
      url: '/en/projects',
      root: {
        data: {},
        firstChild: {
          data: {},
          firstChild: { data: { description: 'app.seo.projects' }, firstChild: null }
        }
      }
    } as unknown as RouterStateSnapshot;

    strategy.updateTitle(snapshot);

    expect(pageMeta.update).toHaveBeenCalledOnceWith(
      'Projects | Portfolio',
      'app.seo.projects',
      '/en/projects'
    );
  });

  it('should preserve the current document title when the route has no title', () => {
    spyOn(strategy, 'buildTitle').and.returnValue(undefined);

    strategy.updateTitle({} as RouterStateSnapshot);

    expect(i18nService.instant).not.toHaveBeenCalled();
    expect(title.setTitle).not.toHaveBeenCalled();
  });
});
