import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-page.html',
  styleUrls: ['./contact-page.scss']
})
export class ContactPage {
  readonly contactForm;

  constructor(private readonly formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(2000)]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      console.warn(
        'ContactPage: tentative de soumission avec formulaire invalide.'
      );
      this.contactForm.markAllAsTouched();
      return;
    }

    try {
      const formValue = this.contactForm.getRawValue();
      console.log('Contact form payload:', formValue);
    } catch (error) {
      console.error(
        'ContactPage: erreur pendant la soumission du formulaire.',
        error
      );
    }
  }
}