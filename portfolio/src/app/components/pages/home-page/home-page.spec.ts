import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { LANGUAGE_OPTIONS } from '@common/constants/language-options';
import { AppLanguage } from '@common/enums/app-language.enum';
import { ARRIVED_FROM_HOME_STATE } from '../../../services/app-state';
import { LanguageService } from '../../../services/language';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([]), ...provideTestI18n()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should play the exit animation before switching language and opening experiences', () => {
    jasmine.clock().install();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const languageService = TestBed.inject(LanguageService);
    languageService.setLanguage(AppLanguage.EN);

    clickLanguage(AppLanguage.FR);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.home')?.classList).toContain('home--leaving');
    expect(navigate).not.toHaveBeenCalled();
    expect(languageService.currentLanguage()).toBe(AppLanguage.EN);

    jasmine.clock().tick(HomePage.EXIT_DURATION_MS);

    expect(languageService.currentLanguage()).toBe(AppLanguage.FR);
    expect(navigate).toHaveBeenCalledOnceWith(['/', AppLanguage.FR, 'experiences'], {
      state: { [ARRIVED_FROM_HOME_STATE]: true }
    });
  });

  it('should take the elements out in reverse order and then fade the background', () => {
    component.leaveWithLanguage(AppLanguage.DE);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const style = (selector: string) => getComputedStyle(host.querySelector(selector)!);
    const background = getComputedStyle(host.querySelector('.home')!, '::before');
    const delay = (selector: string) => parseFloat(style(selector).animationDelay);

    expect(style('.home__languages').animationName).toContain('home-languages-leave');
    expect(style('.home__description-row').animationName).toContain('home-content-leave');
    expect(style('.home__headline').animationName).toContain('home-content-leave');
    expect(style('.home__image').animationName).toContain('home-image-leave');
    expect(delay('.home__languages')).toBeLessThan(delay('.home__description-row'));
    expect(delay('.home__description-row')).toBeLessThan(delay('.home__headline'));
    expect(delay('.home__headline')).toBeLessThan(delay('.home__image'));
    expect(background.animationName).toContain('home-background-fade-out');
    expect(
      (parseFloat(background.animationDelay) + parseFloat(background.animationDuration)) * 1000
    ).toBeLessThanOrEqual(HomePage.EXIT_DURATION_MS);
  });

  it('should ignore further language clicks while leaving', () => {
    jasmine.clock().install();
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);

    component.leaveWithLanguage(AppLanguage.FR);
    component.leaveWithLanguage(AppLanguage.NL);
    jasmine.clock().tick(HomePage.EXIT_DURATION_MS);

    expect(navigate).toHaveBeenCalledOnceWith(['/', AppLanguage.FR, 'experiences'], jasmine.any(Object));
  });

  it('should open experiences immediately when reduced motion is preferred', () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);

    component.leaveWithLanguage(AppLanguage.IT);

    expect(component.isLeaving()).toBeFalse();
    expect(navigate).toHaveBeenCalledOnceWith(['/', AppLanguage.IT, 'experiences'], jasmine.any(Object));
  });

  function clickLanguage(language: AppLanguage): void {
    const buttons = (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '.language-switcher__button'
    );

    buttons[LANGUAGE_OPTIONS.findIndex((option) => option.code === language)].click();
  }

  it('should animate the portrait, presentation and language controls into view', () => {
    const host = fixture.nativeElement as HTMLElement;
    const portrait = host.querySelector<HTMLElement>('.home__image');
    const headline = host.querySelector<HTMLElement>('.home__headline');
    const description = host.querySelector<HTMLElement>(
      '.home__description-row'
    );
    const languages = host.querySelector<HTMLElement>('.home__languages');

    expect(getComputedStyle(portrait!).animationName).toContain(
      'home-image-enter'
    );
    expect(getComputedStyle(headline!).animationName).toContain(
      'home-content-enter'
    );
    expect(getComputedStyle(description!).animationName).toContain(
      'home-content-enter'
    );
    expect(getComputedStyle(languages!).animationName).toContain(
      'home-languages-enter'
    );
  });
});
