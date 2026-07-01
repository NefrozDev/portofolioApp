import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Experience } from '../../../../../../Common/models/experience.model';

@Component({
  selector: 'app-experience-card',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './experience-card.html',
  styleUrls: ['./experience-card.scss']
})
export class ExperienceCard {
  readonly experience = input.required<Experience>();
  readonly toggle = output<string>();

  onToggle(): void {
    const currentExperience = this.experience();

    if (!currentExperience?.id) {
      console.warn('ExperienceCard: missing experience id.');
      return;
    }

    this.toggle.emit(currentExperience.id);
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';

    const placeholder = document.createElement('span');
    placeholder.textContent = '[Logo]';

    img.parentElement?.appendChild(placeholder);
  }
}
