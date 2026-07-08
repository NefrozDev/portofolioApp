import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ContactLink {
  readonly labelKey: string;
  readonly value: string;
  readonly href: string;
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
      labelKey: 'contact.links.phone',
      value: '04/45.36.12.18',
      href: 'tel:0445361218'
    },
    {
      labelKey: 'contact.links.email',
      value: 'stevendemoor@gmail.com',
      href: 'mailto:stevendemoor@gmail.com'
    },
    {
      labelKey: 'contact.links.linkedin',
      value: 'LinkedIn',
      href: '#',
      external: true
    }
  ];
}
