import { Component, computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { distinctUntilChanged } from 'rxjs';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ProjectSidebar } from '../../shared/project-sidebar/project-sidebar';
import { ProjectDetail } from '../../shared/project-detail/project-detail';
import { Project } from '@common/models/project.model';
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
  readonly selectedCategory = signal<'all' | Project['category']>('all');
  readonly selectedProjectId = signal<string>('');
  readonly projects = signal<Project[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);

  readonly filteredProjects = computed(() => {
    const category = this.selectedCategory();
    const projects = this.projects();

    if (category === 'all') {
      return projects;
    }

    return projects.filter((project) => project.category === category);
  });

  readonly selectedProject = computed(() => {
    const projectId = this.selectedProjectId();
    const projects = this.filteredProjects();

    return (
      projects.find((project) => project.id === projectId) ??
      projects[0] ??
      null
    );
  });

  constructor(
    private readonly projectsApi: ProjectsApi,
    languageService: LanguageService
  ) {
    toObservable(languageService.currentLanguage)
      .pipe(distinctUntilChanged(), takeUntilDestroyed())
      .subscribe(() => this.loadProjects());
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

        this.selectedProjectId.set(projects[0].id);
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

  selectCategory(category: 'all' | Project['category']): void {
    this.selectedCategory.set(category);

    const firstProject = this.filteredProjects()[0];

    if (!firstProject) {
      console.warn('ProjectsPage: no data available for this category.');
      this.selectedProjectId.set('');
      return;
    }

    this.selectedProjectId.set(firstProject.id);
  }

  selectProject(projectId: string): void {
    if (!projectId) {
      console.warn('ProjectsPage: empty projectId ignored.');
      return;
    }

    this.selectedProjectId.set(projectId);
  }
}
