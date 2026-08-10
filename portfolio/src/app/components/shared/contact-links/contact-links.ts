import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { PORTFOLIO_PROFILE } from '../../../../../../Common/constants/portfolio-profile';

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
      value: PORTFOLIO_PROFILE.email,
      href: `mailto:${PORTFOLIO_PROFILE.email}`,
      iconSrc: '/widgets/email.svg'
    },
    {
      value: 'LinkedIn',
      href: PORTFOLIO_PROFILE.linkedInUrl,
      iconSrc: '/widgets/linkedin.svg',
      external: true
    }
  ];
}
