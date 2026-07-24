import { Component, ElementRef, computed, inject, input, output, viewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';
import { Experience } from '../../../../../../Common/models/experience.model';
import { getGlossaryInfoKey } from '@common/constants/glossary';
import { InfoTerm } from '../info-term/info-term';

@Component({
  selector: 'app-experience-card',
  standalone: true,
  imports: [InfoTerm, TranslatePipe],
  templateUrl: './experience-card.html',
  styleUrls: ['./experience-card.scss']
})
export class ExperienceCard {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly recommendationDialog =
    viewChild<ElementRef<HTMLDialogElement>>('recommendationDialog');

  readonly glossaryInfoKey = getGlossaryInfoKey;
  readonly experience = input.required<Experience>();
  readonly toggle = output<string>();
  readonly safeRecommendationLetterUrl = computed(() => {
    const url = this.experience().recommendationLetterUrl;

    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  onToggle(): void {
    const currentExperience = this.experience();

    if (!currentExperience?.id) {
      console.warn('ExperienceCard: missing experience id.');
      return;
    }

    this.toggle.emit(currentExperience.id);
  }

  openRecommendationLetter(): void {
    if (!this.experience().recommendationLetterUrl) {
      return;
    }

    this.recommendationDialog()?.nativeElement.showModal();
  }

  closeRecommendationLetter(): void {
    this.recommendationDialog()?.nativeElement.close();
  }

  closeRecommendationLetterFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeRecommendationLetter();
    }
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';

    const placeholder = document.createElement('span');
    placeholder.textContent = '[Logo]';

    img.parentElement?.appendChild(placeholder);
  }
}
