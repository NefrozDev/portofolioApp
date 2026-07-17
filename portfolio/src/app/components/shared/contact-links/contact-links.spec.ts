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

  it('should render the three clickable contact widgets', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.contact-links__item'
    ) as NodeListOf<HTMLAnchorElement>;
    const icons = fixture.nativeElement.querySelectorAll(
      '.contact-links__icon'
    ) as NodeListOf<HTMLImageElement>;
    const labels = fixture.nativeElement.querySelectorAll(
      '.contact-links__label'
    ) as NodeListOf<HTMLElement>;

    expect(links.length).toBe(3);
    expect(links[0].getAttribute('href')).toBe('tel:0445361218');
    expect(links[1].getAttribute('href')).toBe(
      'mailto:stevendemoor@gmail.com'
    );
    expect(links[2].getAttribute('href')).toBe(
      'https://www.linkedin.com/in/steven-de-moor-a68124162/'
    );

    expect(icons.length).toBe(3);
    expect(icons[0].getAttribute('src')).toBe('/widgets/phone.svg');
    expect(icons[1].getAttribute('src')).toBe('/widgets/email.svg');
    expect(icons[2].getAttribute('src')).toBe('/widgets/linkedin.svg');
    expect(labels.length).toBe(0);
  });
});
