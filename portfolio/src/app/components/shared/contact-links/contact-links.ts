import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ContactLink {
  readonly value: string;
  readonly href: string;
  readonly iconSrc: string;
  readonly external?: boolean;
}

@Component({
  selector: 'app-contact-links',
  imports: [TranslatePipe],
  templateUrl: './contact-links.html',
  styleUrl: './contact-links.scss',
})
export class ContactLinks {
  readonly links: ContactLink[] = [
    {
      value: 'nvonefroz@gmail.com',
      href: 'mailto:nvonefroz@gmail.com',
      iconSrc: '/widgets/email.svg'
    },
    {
      value: 'LinkedIn',
      href: 'https://www.linkedin.com/in/steven-de-moor-a68124162/',
      iconSrc: '/widgets/linkedin.svg',
      external: true
    }
  ];
}
