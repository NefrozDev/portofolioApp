import { Component, input, output } from '@angular/core';
import { Experience } from '../../../../../../Common/models/experience.model';

@Component({
  selector: 'app-experience-card',
  standalone: true,
  templateUrl: './experience-card.html',
  styleUrls: ['./experience-card.scss']
})
export class ExperienceCard {
  readonly experience = input.required<Experience>();
  readonly toggle = output<string>();

  onToggle(): void {
    const currentExperience = this.experience();

    if (!currentExperience?.id) {
      console.warn('ExperienceCard: id expérience manquant.');
      return;
    }

    this.toggle.emit(currentExperience.id);
  }
}