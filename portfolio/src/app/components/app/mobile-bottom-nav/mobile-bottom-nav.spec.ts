import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppLanguage } from '@common/enums/app-language.enum';
import { LanguageService } from '../../../services/language';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { MobileBottomNav } from './mobile-bottom-nav';

describe('MobileBottomNav', () => {
  let component: MobileBottomNav;
  let fixture: ComponentFixture<MobileBottomNav>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MobileBottomNav],
      providers: [provideRouter([]), ...provideTestI18n()]
    })
    .compileComponents();

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 0, 5));
    fixture = TestBed.createComponent(MobileBottomNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the navigation destinations and localized CV generator', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.mobile-bottom-nav__link'
    ) as NodeListOf<HTMLAnchorElement>;

    expect(links.length).toBe(5);
    expect(Array.from(links).map((link) => link.textContent?.trim())).toEqual([
      'Home',
      'Experiences',
      'Projects',
      'Contact',
      'CV'
    ]);

    const cvLink = links[4];
    expect(cvLink.getAttribute('href')).toBe('http://localhost:3000/api/cv?lang=en');
    expect(cvLink.getAttribute('download')).toBe('CV-Steven-De-Moor-05-01-2026-EN.pdf');
    expect(cvLink.getAttribute('aria-label')).toBe('Download CV');
  });

  it('should switch the CV download to Word while W is held', () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    fixture.detectChanges();

    const cvLink = fixture.nativeElement.querySelector(
      '.mobile-bottom-nav__cv-link'
    ) as HTMLAnchorElement;

    expect(cvLink.getAttribute('href')).toBe(
      'http://localhost:3000/api/cv?lang=en&format=docx'
    );
    expect(cvLink.getAttribute('download')).toBe('CV-Steven-De-Moor-05-01-2026-EN.docx');

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
  });

  it('should update the CV filename when the language or date changes', () => {
    TestBed.inject(LanguageService).setLanguage(AppLanguage.NL);
    jasmine.clock().mockDate(new Date(2026, 11, 31));
    fixture.detectChanges();

    const cvLink: HTMLAnchorElement = fixture.nativeElement.querySelector('.mobile-bottom-nav__cv-link');
    expect(cvLink.getAttribute('download')).toBe('CV-Steven-De-Moor-31-12-2026-NL.pdf');

    jasmine.clock().mockDate(new Date(2027, 0, 1));
    component.enableWordCvDownload();
    fixture.detectChanges();

    expect(cvLink.getAttribute('download')).toBe('CV-Steven-De-Moor-01-01-2027-NL.docx');
  });
});
