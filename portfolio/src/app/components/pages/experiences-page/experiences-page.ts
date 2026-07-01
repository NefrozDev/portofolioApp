import { Component, computed, signal } from '@angular/core';
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
  readonly selectedTechnologyTags = signal<string[]>([]);
  readonly isTechnologyTagRailDragging = signal<boolean>(false);
  readonly availableTechnologyTags = computed(() => {
    const tags = this.experiences().flatMap((experience) => experience.technologies);

    return [...new Set(tags)].sort((firstTag, secondTag) => firstTag.localeCompare(secondTag));
  });
  private readonly technologyTagDragThresholdPx = 6;
  private activeTechnologyTagPointerId: number | null = null;
  private technologyTagDragStartX = 0;
  private technologyTagDragStartScrollLeft = 0;
  private didDragTechnologyTagRail = false;
  private suppressNextTechnologyTagClick = false;
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

  toggleTechnologyFilterFromClick(event: MouseEvent, technology: string): void {
    if (this.shouldIgnoreTechnologyFilterClick(event)) {
      return;
    }

    this.toggleTechnologyFilter(technology);
  }

  clearTechnologyFilters(): void {
    this.selectedTechnologyTags.set([]);
  }

  clearTechnologyFiltersFromClick(event: MouseEvent): void {
    if (this.shouldIgnoreTechnologyFilterClick(event)) {
      return;
    }

    this.clearTechnologyFilters();
  }

  isTechnologySelected(technology: string): boolean {
    return this.selectedTechnologyTags().includes(technology);
  }

  onTechnologyTagRailWheel(event: WheelEvent): void {
    const rail = event.currentTarget as HTMLElement | null;

    if (!rail || rail.scrollWidth <= rail.clientWidth) {
      return;
    }

    const scrollDelta = event.deltaY !== 0 ? event.deltaY : event.deltaX;

    if (scrollDelta === 0) {
      return;
    }

    event.preventDefault();
    rail.scrollLeft += scrollDelta;
  }

  onTechnologyTagRailPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;

    if (!rail) {
      return;
    }

    this.activeTechnologyTagPointerId = event.pointerId;
    this.technologyTagDragStartX = event.clientX;
    this.technologyTagDragStartScrollLeft = rail.scrollLeft;
    this.didDragTechnologyTagRail = false;
    rail.setPointerCapture?.(event.pointerId);
  }

  onTechnologyTagRailPointerMove(event: PointerEvent): void {
    if (this.activeTechnologyTagPointerId !== event.pointerId) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;

    if (!rail) {
      return;
    }

    const dragOffset = event.clientX - this.technologyTagDragStartX;

    if (!this.didDragTechnologyTagRail && Math.abs(dragOffset) < this.technologyTagDragThresholdPx) {
      return;
    }

    this.didDragTechnologyTagRail = true;
    this.suppressNextTechnologyTagClick = true;
    this.isTechnologyTagRailDragging.set(true);
    event.preventDefault();
    rail.scrollLeft = this.technologyTagDragStartScrollLeft - dragOffset;
  }

  onTechnologyTagRailPointerEnd(event: PointerEvent): void {
    if (this.activeTechnologyTagPointerId !== event.pointerId) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;
    rail?.releasePointerCapture?.(event.pointerId);

    this.activeTechnologyTagPointerId = null;
    this.didDragTechnologyTagRail = false;
    this.isTechnologyTagRailDragging.set(false);

    window.setTimeout(() => {
      this.suppressNextTechnologyTagClick = false;
    });
  }

  private keepExistingTechnologyFilters(experiences: Experience[]): void {
    const availableTags = new Set(experiences.flatMap((experience) => experience.technologies));

    this.selectedTechnologyTags.update((selectedTags) =>
      selectedTags.filter((selectedTag) => availableTags.has(selectedTag))
    );
  }

  private shouldIgnoreTechnologyFilterClick(event: MouseEvent): boolean {
    if (!this.suppressNextTechnologyTagClick) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    this.suppressNextTechnologyTagClick = false;

    return true;
  }
}
