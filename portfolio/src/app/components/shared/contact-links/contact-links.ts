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
      value: '04/45.36.12.18',
      href: 'tel:0445361218',
      iconSrc: '/widgets/phone.svg'
    },
    {
      value: 'stevendemoor@gmail.com',
      href: 'mailto:stevendemoor@gmail.com',
      iconSrc: '/widgets/email.svg'
    },
    {
      value: 'LinkedIn',
      href: '#',
      iconSrc: '/widgets/linkedin.svg',
      external: true
    }
  ];
}
