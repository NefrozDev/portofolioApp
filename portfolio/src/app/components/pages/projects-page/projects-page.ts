import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ProjectSidebar } from '../../shared/project-sidebar/project-sidebar';
import { ProjectDetail } from '../../shared/project-detail/project-detail';
import {
  Project,
  ProjectCategory,
  ProjectTag
} from '@common/models/project.model';
import { ProjectsApi } from '../../../services/api/projects-api';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [SectionHero, ProjectSidebar, ProjectDetail, TranslatePipe],
  templateUrl: './projects-page.html',
  styleUrls: ['./projects-page.scss']
})
export class ProjectsPage {
  readonly categories: Array<{
    labelKey: string;
    value: 'all' | ProjectCategory;
  }> = [
    { labelKey: 'projects.categories.all', value: 'all' },
    { labelKey: 'projects.categories.frontend', value: 'frontend' },
    { labelKey: 'projects.categories.backend', value: 'backend' },
    { labelKey: 'projects.categories.fullstack', value: 'fullstack' },
    { labelKey: 'projects.categories.uiUx', value: 'ui-ux' },
    { labelKey: 'projects.categories.mobile', value: 'mobile' },
    { labelKey: 'projects.categories.devopsCloud', value: 'devops-cloud' },
    { labelKey: 'projects.categories.aiData', value: 'ai-data' }
  ];

  readonly selectedCategory = signal<'all' | ProjectCategory>('all');
  readonly selectedTags = signal<ProjectTag[]>([]);
  readonly appliedTags = signal<ProjectTag[]>([]);
  readonly selectedProjectId = signal<string>('');
  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);

  readonly availableTags = computed(() => {
    const tags = this.projects().flatMap((project) => project.tags);

    return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
  });

  readonly filteredProjects = computed(() => {
    const category = this.selectedCategory();
    const selectedTags = this.appliedTags();

    return this.projects().filter((project) => {
      const matchesCategory =
        category === 'all' || project.category === category;
      const matchesTags =
        !selectedTags.length ||
        project.tags.some((tag) => selectedTags.includes(tag));

      return matchesCategory && matchesTags;
    });
  });

  readonly hasActiveFilters = computed(
    () => this.selectedCategory() !== 'all' || this.selectedTags().length > 0
  );

  readonly selectedProject = computed(() => {
    const projectId = this.selectedProjectId();
    const projects = this.filteredProjects();

    return (
      projects.find((project) => project.id === projectId) ??
      projects[0] ??
      null
    );
  });

  private readonly tagSelectionChanges = new Subject<ProjectTag[]>();

  constructor(
    private readonly projectsApi: ProjectsApi,
    languageService: LanguageService
  ) {
    toObservable(languageService.currentLanguage)
      .pipe(distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.loadProjects());

    this.tagSelectionChanges
      .pipe(debounceTime(120), takeUntilDestroyed())
      .subscribe((tags) => {
        this.appliedTags.set(tags);
        this.keepOrSelectFilteredProject();
      });
  }

  private loadProjects(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.projectsApi.getProjects().subscribe({
      next: (projects) => {
        this.projects.set(projects);

        if (!projects.length) {
          console.warn('ProjectsPage: no projects available on load.');
          this.selectedProjectId.set('');
          this.isLoading.set(false);
          return;
        }

        this.selectFirstFilteredProject();
        this.isLoading.set(false);
      },
      error: (error: unknown) => {
        console.error('ProjectsPage: failed to load projects.', error);
        this.projects.set([]);
        this.selectedProjectId.set('');
        this.loadError.set('projects.loadError');
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(category: 'all' | ProjectCategory): void {
    this.selectedCategory.set(category);
    this.keepOrSelectFilteredProject();
  }

  toggleTag(tag: ProjectTag): void {
    const selectedTags = this.selectedTags();
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];

    this.selectedTags.set(updatedTags);
    this.tagSelectionChanges.next(updatedTags);
  }

  isTagSelected(tag: ProjectTag): boolean {
    return this.selectedTags().includes(tag);
  }

  clearTags(): void {
    this.selectedTags.set([]);
    this.appliedTags.set([]);
    this.tagSelectionChanges.next([]);
    this.keepOrSelectFilteredProject();
  }

  clearFilters(): void {
    this.selectedCategory.set('all');
    this.clearTags();
  }

  selectProject(projectId: string): void {
    if (!projectId) {
      console.warn('ProjectsPage: empty projectId ignored.');
      return;
    }

    this.selectedProjectId.set(projectId);
  }

  private keepOrSelectFilteredProject(): void {
    const projects = this.filteredProjects();
    const selectedProjectStillExists = projects.some(
      (project) => project.id === this.selectedProjectId()
    );

    if (!selectedProjectStillExists) {
      this.selectFirstFilteredProject();
    }
  }

  private selectFirstFilteredProject(): void {
    this.selectedProjectId.set(this.filteredProjects()[0]?.id ?? '');
  }
}
