import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { MobileBottomNav } from './mobile-bottom-nav';

describe('MobileBottomNav', () => {
  let component: MobileBottomNav;
  let fixture: ComponentFixture<MobileBottomNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileBottomNav],
      providers: [provideRouter([]), ...provideTestI18n()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileBottomNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    expect(cvLink.getAttribute('download')).toBe('Steven-De-Moor-CV.pdf');
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
    expect(cvLink.getAttribute('download')).toBe('Steven-De-Moor-CV.docx');

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }));
  });
});
