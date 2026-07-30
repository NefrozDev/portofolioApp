import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot } from '@angular/router';

import { I18nService } from './i18n';
import { LocalizedTitleStrategy } from './localized-title-strategy';

describe('LocalizedTitleStrategy', () => {
  let strategy: LocalizedTitleStrategy;
  let title: jasmine.SpyObj<Title>;
  let i18nService: jasmine.SpyObj<I18nService>;

  beforeEach(() => {
    title = jasmine.createSpyObj<Title>('Title', ['setTitle']);
    i18nService = jasmine.createSpyObj<I18nService>('I18nService', ['instant']);

    TestBed.configureTestingModule({
      providers: [
        LocalizedTitleStrategy,
        { provide: Title, useValue: title },
        { provide: I18nService, useValue: i18nService }
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

  it('should preserve the current document title when the route has no title', () => {
    spyOn(strategy, 'buildTitle').and.returnValue(undefined);

    strategy.updateTitle({} as RouterStateSnapshot);

    expect(i18nService.instant).not.toHaveBeenCalled();
    expect(title.setTitle).not.toHaveBeenCalled();
  });
});
