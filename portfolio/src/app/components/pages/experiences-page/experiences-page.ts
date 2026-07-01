import { Component, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs';
import { MobileBottomNav } from '../../app/mobile-bottom-nav/mobile-bottom-nav';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ExperienceCard } from '../../shared/experience-card/experience-card';
import { Experience } from '@common/models/experience.model';
import { ExperiencesApi } from '../../../services/api/experiences-api';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-experiences-page',
  standalone: true,
  imports: [MobileBottomNav, SectionHero, ExperienceCard, TranslatePipe],
  templateUrl: './experiences-page.html',
  styleUrls: ['./experiences-page.scss']
})
export class ExperiencesPage {
  readonly experiences = signal<Experience[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);

  constructor(
    private readonly experiencesApi: ExperiencesApi,
    languageService: LanguageService
  ) {
    toObservable(languageService.currentLanguage)
      .pipe(distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.loadExperiences());
  }

  private loadExperiences(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.experiencesApi.getExperiences().subscribe({
      next: (experiences) => {
        this.experiences.set(experiences);
        this.isLoading.set(false);

        if (!experiences.length) {
          console.warn('ExperiencesPage: no experiences available on load.');
        }
      },
      error: (error: unknown) => {
        console.error('ExperiencesPage: failed to load experiences.', error);
        this.experiences.set([]);
        this.loadError.set('experiences.loadError');
        this.isLoading.set(false);
      }
    });
  }

  toggleExperience(experienceId: string): void {
    if (!experienceId) {
      console.warn('ExperiencesPage: empty experienceId ignored.');
      return;
    }

    this.experiences.update((items) =>
      items.map((item) =>
        item.id === experienceId
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  }
}
