import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-hero',
  standalone: true,
  templateUrl: './section-hero.html',
  styleUrls: ['./section-hero.scss']
})
export class SectionHero {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
}