import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs';
import { MobileBottomNav } from '../../app/mobile-bottom-nav/mobile-bottom-nav';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ExperienceCard } from '../../shared/experience-card/experience-card';
import { ExperienceLoader } from '../../shared/experience-loader/experience-loader';
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
  readonly isTechnologyTagRailDragging = signal<boolean>(false);

  readonly availableTechnologyTags = computed(() => {
    const tags = this.experiences().flatMap((experience) => experience.technologies);

    return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
  });

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

  private readonly dragThresholdPx = 6;

  private activePointerId: number | null = null;
  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private hasDragged = false;
  private suppressNextClick = false;

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

  isTechnologySelected(technology: string): boolean {
    return this.selectedTechnologyTags().includes(technology);
  }

  onTechnologyFilterClick(event: MouseEvent, technology: string): void {
    if (this.shouldSuppressClick(event)) {
      return;
    }

    this.toggleTechnologyFilter(technology);
  }

  onClearTechnologyFiltersClick(event: MouseEvent): void {
    if (this.shouldSuppressClick(event)) {
      return;
    }

    this.clearTechnologyFilters();
  }

  onTagRailWheel(event: WheelEvent): void {
    const rail = event.currentTarget as HTMLElement | null;

    if (!rail || rail.scrollWidth <= rail.clientWidth) {
      return;
    }

    const scrollDelta = event.deltaY || event.deltaX;

    if (!scrollDelta) {
      return;
    }

    event.preventDefault();
    rail.scrollLeft += scrollDelta;
  }

  onTagRailPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;

    if (!rail) {
      return;
    }

    this.activePointerId = event.pointerId;
    this.dragStartX = event.clientX;
    this.dragStartScrollLeft = rail.scrollLeft;
    this.hasDragged = false;
    this.suppressNextClick = false;

    rail.setPointerCapture(event.pointerId);
  }

  onTagRailPointerMove(event: PointerEvent): void {
    if (this.activePointerId !== event.pointerId) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;

    if (!rail) {
      return;
    }

    const dragOffset = event.clientX - this.dragStartX;

    if (!this.hasDragged && Math.abs(dragOffset) < this.dragThresholdPx) {
      return;
    }

    this.hasDragged = true;
    this.suppressNextClick = true;
    this.isTechnologyTagRailDragging.set(true);

    event.preventDefault();
    rail.scrollLeft = this.dragStartScrollLeft - dragOffset;
  }

  onTagRailPointerEnd(event: PointerEvent): void {
    if (this.activePointerId !== event.pointerId) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;

    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }

    this.activePointerId = null;
    this.hasDragged = false;
    this.isTechnologyTagRailDragging.set(false);

    window.setTimeout(() => {
      this.suppressNextClick = false;
    }, 0);
  }

  private keepExistingTechnologyFilters(experiences: Experience[]): void {
    const availableTags = new Set(
      experiences.flatMap((experience) => experience.technologies)
    );

    this.selectedTechnologyTags.update((selectedTags) =>
      selectedTags.filter((selectedTag) => availableTags.has(selectedTag))
    );
  }

  private shouldSuppressClick(event: MouseEvent): boolean {
    if (!this.suppressNextClick) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();

    this.suppressNextClick = false;

    return true;
  }
}
