import { Component, computed, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ExperienceCard } from '../../shared/experience-card/experience-card';
import { ExperienceLoader } from '../../shared/experience-loader/experience-loader';
import {
  FilterRail,
  FilterRailOption
} from '../../shared/filter-rail/filter-rail';
import { Experience } from '@common/models/experience.model';
import { getGlossaryInfoKey } from '@common/constants/glossary';
import { ExperiencesApi } from '../../../services/api/experiences-api';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-experiences-page',
  standalone: true,
  imports: [
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
  private static readonly ENTRANCE_DURATION_MS = 2000;
  private static readonly CARD_SETTLE_DURATION_MS = 600;
  private static readonly FIRST_EXPERIENCE_OPEN_DELAY_MS = 1000;

  readonly experiences = signal<Experience[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);
  readonly isEntranceAnimating = signal<boolean>(false);

  readonly selectedTechnologyTags = signal<string[]>([]);
  private entranceTimer: ReturnType<typeof setTimeout> | undefined;
  private firstExperienceTimer: ReturnType<typeof setTimeout> | undefined;

  readonly availableTechnologyTags = computed(() => {
    const tags = this.experiences().flatMap((experience) => experience.technologies);

    return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
  });

  readonly technologyFilterOptions = computed<FilterRailOption[]>(() =>
    this.availableTechnologyTags().map((technology) => ({
      value: technology,
      label: technology,
      infoKey: getGlossaryInfoKey(technology)
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
    languageService: LanguageService,
    destroyRef: DestroyRef
  ) {
    destroyRef.onDestroy(() => this.cancelEntranceAnimation());

    toObservable(languageService.currentLanguage)
      .pipe(distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.loadExperiences());
  }

  private loadExperiences(): void {
    this.isLoading.set(true);
    this.loadError.set(null);
    this.cancelEntranceAnimation();

    this.experiencesApi.getExperiences().subscribe({
      next: (experiences) => {
        const collapsedExperiences = experiences.map((experience) => ({
          ...experience,
          isExpanded: false
        }));

        this.experiences.set(collapsedExperiences);
        this.keepExistingTechnologyFilters(experiences);
        this.isLoading.set(false);

        if (experiences.length) {
          this.startEntranceAnimation();
        } else {
          console.warn('ExperiencesPage: no experiences available on load.');
        }
      },
      error: (error: unknown) => {
        this.cancelEntranceAnimation();
        console.error('ExperiencesPage: failed to load experiences.', error);
        this.experiences.set([]);
        this.selectedTechnologyTags.set([]);
        this.loadError.set('experiences.loadError');
        this.isLoading.set(false);
      }
    });
  }

  entranceAnimationDelay(index: number, total: number): string {
    if (total <= 1) {
      return '0ms';
    }

    const availableDelay =
      ExperiencesPage.ENTRANCE_DURATION_MS -
      ExperiencesPage.CARD_SETTLE_DURATION_MS;

    return `${Math.round((index / (total - 1)) * availableDelay)}ms`;
  }

  entranceAnimationDuration(total: number): string {
    const duration = total <= 1
      ? ExperiencesPage.ENTRANCE_DURATION_MS
      : ExperiencesPage.CARD_SETTLE_DURATION_MS;

    return `${duration}ms`;
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

  private startEntranceAnimation(): void {
    if (this.prefersReducedMotion()) {
      this.expandFirstExperience();
      return;
    }

    this.isEntranceAnimating.set(true);
    this.firstExperienceTimer = setTimeout(
      () => this.openFirstExperience(),
      ExperiencesPage.FIRST_EXPERIENCE_OPEN_DELAY_MS
    );
    this.entranceTimer = setTimeout(
      () => this.finishEntranceAnimation(),
      ExperiencesPage.ENTRANCE_DURATION_MS
    );
  }

  private finishEntranceAnimation(): void {
    if (this.entranceTimer) {
      clearTimeout(this.entranceTimer);
      this.entranceTimer = undefined;
    }

    this.isEntranceAnimating.set(false);
  }

  private openFirstExperience(): void {
    if (this.firstExperienceTimer) {
      clearTimeout(this.firstExperienceTimer);
      this.firstExperienceTimer = undefined;
    }

    this.expandFirstExperience();
  }

  private cancelEntranceAnimation(): void {
    if (this.entranceTimer) {
      clearTimeout(this.entranceTimer);
      this.entranceTimer = undefined;
    }

    if (this.firstExperienceTimer) {
      clearTimeout(this.firstExperienceTimer);
      this.firstExperienceTimer = undefined;
    }

    this.isEntranceAnimating.set(false);
  }

  private expandFirstExperience(): void {
    this.experiences.update((items) =>
      items.map((item, index) =>
        index === 0 ? { ...item, isExpanded: true } : item
      )
    );
  }

  private prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

}
