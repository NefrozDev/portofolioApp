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

  it('should render the four primary navigation destinations', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.mobile-bottom-nav__link'
    ) as NodeListOf<HTMLAnchorElement>;

    expect(links.length).toBe(4);
    expect(Array.from(links).map((link) => link.textContent?.trim())).toEqual([
      'Home',
      'Experiences',
      'Projects',
      'Contact'
    ]);
  });
});
