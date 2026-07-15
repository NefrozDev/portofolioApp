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

  it('should move the hero call to action into the submit button', () => {
    const host = fixture.nativeElement as HTMLElement;
    const submitButton = host.querySelector(
      '.contact-page__submit'
    ) as HTMLButtonElement | null;

    expect(host.querySelector('.contact-page__subtitle-highlight')).toBeNull();
    expect(submitButton?.textContent?.trim()).toBe("Let's talk!");
  });

  it('should require only the name and message fields', () => {
    spyOn(console, 'warn');

    component.onSubmit();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const nameInput = host.querySelector<HTMLInputElement>(
      'input[formControlName="name"]'
    );
    const emailInput = host.querySelector<HTMLInputElement>(
      'input[formControlName="email"]'
    );
    const phoneInput = host.querySelector<HTMLInputElement>(
      'input[formControlName="phone"]'
    );
    const messageTextarea = host.querySelector<HTMLTextAreaElement>(
      'textarea[formControlName="message"]'
    );

    expect(nameInput?.placeholder).toBe('Name is required.');
    expect(emailInput?.placeholder).toBe('Enter your email');
    expect(phoneInput?.placeholder).toBe('Enter your phone number');
    expect(messageTextarea?.placeholder).toBe('Message is required.');

    expect(
      nameInput?.classList.contains('contact-page__field--invalid')
    ).toBeTrue();
    expect(
      emailInput?.classList.contains('contact-page__field--invalid')
    ).toBeFalse();
    expect(
      messageTextarea?.classList.contains('contact-page__field--invalid')
    ).toBeTrue();

    expect(host.textContent).not.toContain('Name is required.');
    expect(host.textContent).not.toContain('Email address is required.');
    expect(host.textContent).not.toContain('Message is required.');
  });

  it('should place the optional phone field to the right of email', () => {
    const host = fixture.nativeElement as HTMLElement;
    const fields = Array.from(
      host.querySelectorAll<HTMLInputElement>('.contact-page__contact-row input')
    );

    expect(fields.map((field) => field.getAttribute('formControlName'))).toEqual([
      'email',
      'phone'
    ]);
  });

  it('should center the form field text and placeholders', () => {
    const host = fixture.nativeElement as HTMLElement;
    const fields = host.querySelectorAll<HTMLElement>(
      '.contact-page__input, .contact-page__textarea'
    );

    expect(fields.length).toBe(4);
    fields.forEach((field) => {
      expect(getComputedStyle(field).textAlign).toBe('center');
    });
  });

  it('should show invalid email feedback inside the email field', () => {
    component.emailControl?.setValue('not-an-email');
    component.emailControl?.markAsTouched();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const emailInput = host.querySelector<HTMLInputElement>(
      'input[formControlName="email"]'
    );
    const inlineMessage = host.querySelector<HTMLElement>(
      '#contact-email-inline-error'
    );

    expect(emailInput?.placeholder).toBe('Enter your email');
    expect(
      emailInput?.classList.contains('contact-page__field--invalid')
    ).toBeTrue();
    expect(
      emailInput?.classList.contains(
        'contact-page__input--with-inline-message'
      )
    ).toBeTrue();
    expect(emailInput?.getAttribute('aria-describedby')).toBe(
      'contact-email-inline-error'
    );
    expect(inlineMessage?.textContent?.trim()).toBe(
      'Email address is invalid.'
    );
  });
});
