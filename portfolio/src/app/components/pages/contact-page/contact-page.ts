import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Contact } from '@common/models/contact.model';
import { ContactApi } from '../../../services/api/contact-api';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-page.html',
  styleUrls: ['./contact-page.scss']
})
export class ContactPage {
  readonly isSubmitting = signal<boolean>(false);
  readonly submitSuccessMessage = signal<string | null>(null);
  readonly submitErrorMessage = signal<string | null>(null);

  readonly contactForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly contactApi: ContactApi
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(2000)]]
    });

    this.contactForm.valueChanges.subscribe(() => {
      this.submitSuccessMessage.set(null);
      this.submitErrorMessage.set(null);
    });
  }

  get nameControl() {
    return this.contactForm.get('name');
  }

  get emailControl() {
    return this.contactForm.get('email');
  }

  get messageControl() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      console.warn(
        'ContactPage: tentative de soumission avec formulaire invalide.'
      );
      console.warn('ContactPage: form errors.', {
        name: this.nameControl?.errors,
        email: this.emailControl?.errors,
        message: this.messageControl?.errors
      });
      this.contactForm.markAllAsTouched();
      return;
    }

    try {
      this.isSubmitting.set(true);
      this.submitSuccessMessage.set(null);
      this.submitErrorMessage.set(null);

      const formValue = this.contactForm.getRawValue();
      const payload: Contact = {
        name: formValue.name ?? '',
        email: formValue.email ?? '',
        message: formValue.message ?? ''
      };

      this.contactApi.sendMessage(payload).subscribe({
        next: (response: { message: string }) => {
          this.submitSuccessMessage.set(
            response.message || 'Votre message a bien été envoyé.'
          );
          this.contactForm.reset({
            name: '',
            email: '',
            message: ''
          });
          this.isSubmitting.set(false);
        },
        error: (error: unknown) => {
          console.error(
            'ContactPage: erreur pendant la soumission du formulaire.',
            error
          );
          this.submitErrorMessage.set(
            'Une erreur est survenue lors de l’envoi du message.'
          );
          this.isSubmitting.set(false);
        }
      });
    } catch (error) {
      console.error(
        'ContactPage: erreur pendant la soumission du formulaire.',
        error
      );
      this.submitErrorMessage.set(
        'Une erreur est survenue lors de la préparation du message.'
      );
      this.isSubmitting.set(false);
    }
  }
}