import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ContactApi } from '../../../services/api/contact-api';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ContactPage } from './contact-page';

describe('ContactPage', () => {
  let component: ContactPage;
  let fixture: ComponentFixture<ContactPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPage],
      providers: [
        ...provideTestI18n(),
        {
          provide: ContactApi,
          useValue: {
            sendMessage: () => of({ message: 'Message sent.' })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render contact links above and outside the form card', () => {
    const host = fixture.nativeElement as HTMLElement;
    const container = host.querySelector('.contact-page__container');
    const links = host.querySelector('app-contact-links');
    const card = host.querySelector('.contact-page__card');

    expect(container).toBeTruthy();
    expect(links).toBeTruthy();
    expect(card).toBeTruthy();
    expect(card?.contains(links)).toBeFalse();

    const children = Array.from(container?.children ?? []);
    expect(children.indexOf(links as Element)).toBeLessThan(
      children.indexOf(card as Element)
    );
  });
});
