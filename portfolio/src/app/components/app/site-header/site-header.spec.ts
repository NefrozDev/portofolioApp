import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppLanguage } from '@common/enums/app-language.enum';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  let component: SiteHeader;
  let fixture: ComponentFixture<SiteHeader>;

  beforeEach(async () => {
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
});
