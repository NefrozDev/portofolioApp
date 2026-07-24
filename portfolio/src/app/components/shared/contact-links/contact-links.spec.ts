import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ContactLinks } from './contact-links';

describe('ContactLinks', () => {
  let component: ContactLinks;
  let fixture: ComponentFixture<ContactLinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactLinks],
      providers: [...provideTestI18n()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactLinks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the two clickable contact widgets', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.contact-links__item'
    ) as NodeListOf<HTMLAnchorElement>;
    const icons = fixture.nativeElement.querySelectorAll(
      '.contact-links__icon'
    ) as NodeListOf<HTMLImageElement>;
    const labels = fixture.nativeElement.querySelectorAll(
      '.contact-links__label'
    ) as NodeListOf<HTMLElement>;

    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe(
      'mailto:nvonefroz@gmail.com'
    );
    expect(links[1].getAttribute('href')).toBe(
      'https://www.linkedin.com/in/steven-de-moor-a68124162/'
    );

    expect(icons.length).toBe(2);
    expect(icons[0].getAttribute('src')).toBe('/widgets/email.svg');
    expect(icons[1].getAttribute('src')).toBe('/widgets/linkedin.svg');
    expect(labels.length).toBe(0);
  });

  it('should highlight each contact link once in consecutive order', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.contact-links__item'
    ) as NodeListOf<HTMLAnchorElement>;

    expect(
      links[0].style.getPropertyValue('--contact-link-highlight-delay')
    ).toBe('250ms');
    expect(
      links[1].style.getPropertyValue('--contact-link-highlight-delay')
    ).toBe('1150ms');
    expect(getComputedStyle(links[0]).animationName).toContain(
      'contact-link-intro-glow'
    );
    expect(getComputedStyle(links[0]).animationIterationCount).toBe('1');
  });
});
