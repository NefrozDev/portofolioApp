import { Component, input, output } from '@angular/core';
import { Project } from '../../../../../../Common/models/project.model';

@Component({
  selector: 'app-project-sidebar',
  standalone: true,
  templateUrl: './project-sidebar.html',
  styleUrls: ['./project-sidebar.scss']
})
export class ProjectSidebar {
  readonly projects = input.required<Project[]>();
  readonly selectedCategory = input.required<'all' | Project['category']>();
  readonly selectedProjectId = input.required<string>();

  readonly categorySelected = output<'all' | Project['category']>();
  readonly projectSelected = output<string>();

  readonly categories: Array<{ label: string; value: 'all' | Project['category'] }> = [
    { label: 'All', value: 'all' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'Fullstack', value: 'fullstack' },
    { label: 'UI / UX', value: 'ui-ux' }
  ];

  selectCategory(category: 'all' | Project['category']): void {
    if (!category) {
      console.warn('ProjectSidebar: catégorie vide ignorée.');
      return;
    }

    this.categorySelected.emit(category);
  }

  selectProject(projectId: string): void {
    if (!projectId) {
      console.warn('ProjectSidebar: projectId vide ignoré.');
      return;
    }

    this.projectSelected.emit(projectId);
  }

  isCategoryActive(category: 'all' | Project['category']): boolean {
    return this.selectedCategory() === category;
  }

  isProjectActive(projectId: string): boolean {
    return this.selectedProjectId() === projectId;
  }
}