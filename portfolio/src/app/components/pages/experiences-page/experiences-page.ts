import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs';
import { MobileBottomNav } from '../../app/mobile-bottom-nav/mobile-bottom-nav';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ExperienceCard } from '../../shared/experience-card/experience-card';
import { ExperienceLoader } from '../../shared/experience-loader/experience-loader';
import {
  FilterRail,
  FilterRailOption
} from '../../shared/filter-rail/filter-rail';
import { Experience } from '@common/models/experience.model';
import { ExperiencesApi } from '../../../services/api/experiences-api';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-experiences-page',
  standalone: true,
  imports: [
    MobileBottomNav,
    SectionHero,
    ExperienceCard,
    ExperienceLoader,
    FilterRail,
    TranslatePipe
  ],
  templateUrl: './experiences-page.html',
  styleUrls: ['./experiences-page.scss']
})
export class ExperiencesPage {
  readonly experiences = signal<Experience[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);

  readonly selectedTechnologyTags = signal<string[]>([]);

  readonly availableTechnologyTags = computed(() => {
    const tags = this.experiences().flatMap((experience) => experience.technologies);

    return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
  });

  readonly technologyFilterOptions = computed<FilterRailOption[]>(() =>
    this.availableTechnologyTags().map((technology) => ({
      value: technology,
      label: technology
    }))
  );

  readonly filteredExperiences = computed(() => {
    const selectedTags = this.selectedTechnologyTags();

    if (!selectedTags.length) {
      return this.experiences();
    }

    const selectedTagSet = new Set(selectedTags);

    return this.experiences().filter((experience) =>
      experience.technologies.some((technology) => selectedTagSet.has(technology))
    );
  });

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
        this.keepExistingTechnologyFilters(experiences);
        this.isLoading.set(false);

        if (!experiences.length) {
          console.warn('ExperiencesPage: no experiences available on load.');
        }
      },
      error: (error: unknown) => {
        console.error('ExperiencesPage: failed to load experiences.', error);
        this.experiences.set([]);
        this.selectedTechnologyTags.set([]);
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

  toggleTechnologyFilter(technology: string): void {
    if (!technology) {
      return;
    }

    this.selectedTechnologyTags.update((selectedTags) =>
      selectedTags.includes(technology)
        ? selectedTags.filter((selectedTag) => selectedTag !== technology)
        : [...selectedTags, technology]
    );
  }

  clearTechnologyFilters(): void {
    this.selectedTechnologyTags.set([]);
  }

  private keepExistingTechnologyFilters(experiences: Experience[]): void {
    const availableTags = new Set(
      experiences.flatMap((experience) => experience.technologies)
    );

    this.selectedTechnologyTags.update((selectedTags) =>
      selectedTags.filter((selectedTag) => availableTags.has(selectedTag))
    );
  }

}
