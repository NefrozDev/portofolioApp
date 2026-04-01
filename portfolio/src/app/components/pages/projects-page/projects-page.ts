import { Component, computed, signal } from '@angular/core';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ProjectSidebar } from '../../shared/project-sidebar/project-sidebar';
import { ProjectDetail } from '../../shared/project-detail/project-detail';
import { Project } from '../../../../../../Common/models/project.model';
import { PortfolioDataService } from '../../../services/portfolio-data';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [SectionHero, ProjectSidebar, ProjectDetail],
  templateUrl: './projects-page.html',
  styleUrls: ['./projects-page.scss']
})
export class ProjectsPage {
  readonly selectedCategory = signal<'all' | Project['category']>('all');
  readonly selectedProjectId = signal<string>('');
  readonly projects = signal<Project[]>([]);

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

  constructor(private readonly portfolioDataService: PortfolioDataService) {
    const projects = this.portfolioDataService.getProjects();
    this.projects.set(projects);

    if (!projects.length) {
      console.warn('ProjectsPage: aucun projet disponible au chargement.');
      return;
    }

    this.selectedProjectId.set(projects[0].id);
  }

  selectCategory(category: 'all' | Project['category']): void {
    this.selectedCategory.set(category);

    const firstProject = this.filteredProjects()[0];

    if (!firstProject) {
      console.warn(
        'ProjectsPage: aucune donnée disponible pour cette catégorie.'
      );
      this.selectedProjectId.set('');
      return;
    }

    this.selectedProjectId.set(firstProject.id);
  }

  selectProject(projectId: string): void {
    if (!projectId) {
      console.warn('ProjectsPage: projectId vide ignoré.');
      return;
    }

    this.selectedProjectId.set(projectId);
  }
}