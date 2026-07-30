import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { AppLanguage } from '@common/enums/app-language.enum';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  let component: SiteHeader;
  let fixture: ComponentFixture<SiteHeader>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [provideRouter([]), ...provideTestI18n()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a decorative attention dot over the navigation', () => {
    const dot = fixture.nativeElement.querySelector(
      '.site-header__attention-dot'
    ) as HTMLElement | null;

    expect(dot).toBeTruthy();
    expect(dot?.getAttribute('aria-hidden')).toBe('true');
    expect(dot?.parentElement?.classList.contains('site-header__nav')).toBeTrue();
  });

  it('should toggle the language menu from the compact trigger', () => {
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.site-header__lang-trigger'
    );

    expect(trigger.textContent).toContain(
      component.currentLanguage().toUpperCase()
    );
    expect(trigger.getAttribute('aria-expanded')).toBe('false');

    trigger.click();
    fixture.detectChanges();

    expect(component.isLanguageMenuOpen()).toBeTrue();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(
      fixture.nativeElement.querySelectorAll('.site-header__lang-option').length
    ).toBe(component.languages.length);
  });

  it('should close the language menu when a language is selected', () => {
    component.isLanguageMenuOpen.set(true);

    component.changeLanguage(AppLanguage.FR);

    expect(component.isLanguageMenuOpen()).toBeFalse();
    expect(component.currentLanguage()).toBe(AppLanguage.FR);
  });

  it('should close the language menu on Escape', () => {
    component.isLanguageMenuOpen.set(true);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(component.isLanguageMenuOpen()).toBeFalse();
  });

  it('should create localized links for home and nested routes', () => {
    expect(component.getLink('')).toEqual(['/', AppLanguage.EN]);
    expect(component.getLink('projects')).toEqual([
      '/',
      AppLanguage.EN,
      'projects'
    ]);
  });

  it('should close the language menu after an outside click', () => {
    component.isLanguageMenuOpen.set(true);
    const outsideElement = document.createElement('button');
    document.body.appendChild(outsideElement);

    component.closeLanguageMenuOnOutsideClick(outsideElement);

    expect(component.isLanguageMenuOpen()).toBeFalse();
    outsideElement.remove();
  });

  it('should keep the language menu open for clicks inside the header', () => {
    component.isLanguageMenuOpen.set(true);

    component.closeLanguageMenuOnOutsideClick(fixture.nativeElement);

    expect(component.isLanguageMenuOpen()).toBeTrue();
  });

  it('should ignore an empty language', () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate');
    spyOn(console, 'warn');

    component.changeLanguage('' as AppLanguage);

    expect(navigate).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it('should replace a supported language segment in the current route', () => {
    const router = TestBed.inject(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('/en/projects');
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);

    component.changeLanguage(AppLanguage.FR);

    expect(navigate).toHaveBeenCalledOnceWith(['/', 'fr', 'projects']);
  });

  it('should prepend the language to a route without a language segment', () => {
    const router = TestBed.inject(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('/legacy/projects');
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);

    component.changeLanguage(AppLanguage.FR);

    expect(navigate).toHaveBeenCalledOnceWith([
      '/',
      'fr',
      'legacy',
      'projects'
    ]);
  });

  it('should navigate to the language root from the application root', () => {
    const router = TestBed.inject(Router);
    spyOnProperty(router, 'url', 'get').and.returnValue('/');
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);

    component.changeLanguage(AppLanguage.FR);

    expect(navigate).toHaveBeenCalledOnceWith(['/', 'fr']);
  });

  it('should position the attention dot beside the active navigation link', () => {
    const dot = fixture.nativeElement.querySelector(
      '.site-header__attention-dot'
    ) as HTMLElement;
    const nav = dot.parentElement as HTMLElement;
    const link = fixture.nativeElement.querySelector(
      '.site-header__link'
    ) as HTMLElement;
    spyOn(nav, 'getBoundingClientRect').and.returnValue({
      left: 10,
      height: 40
    } as DOMRect);
    spyOn(link, 'getBoundingClientRect').and.returnValue({
      left: 50
    } as DOMRect);
    spyOnProperty(dot, 'offsetWidth', 'get').and.returnValue(5);
    spyOnProperty(dot, 'offsetHeight', 'get').and.returnValue(4);
    const internals = component as unknown as {
      currentNavigationIndex: number;
      moveAttentionDot(shouldAnimate: boolean, previousIndex: number): void;
    };
    internals.currentNavigationIndex = 0;

    internals.moveAttentionDot(false, -1);

    expect(dot.style.transform).toBe('translate(28px, 18px)');
    expect(
      dot.classList.contains('site-header__attention-dot--positioned')
    ).toBeTrue();
  });

  it('should animate the attention dot between navigation links', () => {
    const dot = fixture.nativeElement.querySelector(
      '.site-header__attention-dot'
    ) as HTMLElement;
    const nav = dot.parentElement as HTMLElement;
    const links = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.site-header__link'
      ) as NodeListOf<HTMLElement>
    );
    spyOn(nav, 'getBoundingClientRect').and.returnValue({
      left: 0,
      height: 40
    } as DOMRect);
    links.forEach((link, index) => {
      spyOn(link, 'getBoundingClientRect').and.returnValue({
        left: 40 + index * 30
      } as DOMRect);
    });
    spyOnProperty(dot, 'offsetWidth', 'get').and.returnValue(5);
    spyOnProperty(dot, 'offsetHeight', 'get').and.returnValue(4);
    spyOn(window, 'matchMedia').and.returnValue({
      matches: false
    } as MediaQueryList);
    const animation = {
      cancel: jasmine.createSpy('cancel'),
      onfinish: null
    } as unknown as Animation;
    const animate = spyOn(dot, 'animate').and.returnValue(animation);
    const internals = component as unknown as {
      currentNavigationIndex: number;
      moveAttentionDot(shouldAnimate: boolean, previousIndex: number): void;
    };
    internals.currentNavigationIndex = 1;

    internals.moveAttentionDot(true, 0);

    expect(animate).toHaveBeenCalled();
    expect(dot.style.transform).toBe('translate(28px, 18px)');

    animation.onfinish?.call(
      animation,
      new Event('finish') as unknown as AnimationPlaybackEvent
    );

    expect(dot.style.transform).toBe('translate(58px, 18px)');
    expect(animation.cancel).toHaveBeenCalled();
  });

  it('should reset a positioned attention dot and cancel pending work', () => {
    const dot = fixture.nativeElement.querySelector(
      '.site-header__attention-dot'
    ) as HTMLElement;
    dot.classList.add('site-header__attention-dot--positioned');
    const animation = {
      cancel: jasmine.createSpy('cancel')
    } as unknown as Animation;
    const cancelFrame = spyOn(window, 'cancelAnimationFrame');
    const internals = component as unknown as {
      attentionAnimation?: Animation;
      scheduledAnimationFrame?: number;
      hasPositionedAttentionDot: boolean;
      resetAttentionDotVisualPosition(): void;
    };
    internals.attentionAnimation = animation;
    internals.scheduledAnimationFrame = 42;
    internals.hasPositionedAttentionDot = true;

    internals.resetAttentionDotVisualPosition();

    expect(animation.cancel).toHaveBeenCalled();
    expect(cancelFrame).toHaveBeenCalledOnceWith(42);
    expect(
      dot.classList.contains('site-header__attention-dot--positioned')
    ).toBeFalse();
    expect(internals.hasPositionedAttentionDot).toBeFalse();
  });
});
