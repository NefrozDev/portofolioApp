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

  it('should render the three clickable contact placeholders', () => {
    const links = fixture.nativeElement.querySelectorAll(
      '.contact-links__item'
    ) as NodeListOf<HTMLAnchorElement>;

    expect(links.length).toBe(3);
    expect(links[0].getAttribute('href')).toBe('tel:0445361218');
    expect(links[1].getAttribute('href')).toBe(
      'mailto:stevendemoor@gmail.com'
    );
    expect(links[2].getAttribute('href')).toBe('#');
  });
});
