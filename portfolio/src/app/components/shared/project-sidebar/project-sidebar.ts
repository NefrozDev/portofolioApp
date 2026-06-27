import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Project } from '../../../../../../Common/models/project.model';

@Component({
  selector: 'app-project-sidebar',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './project-sidebar.html',
  styleUrls: ['./project-sidebar.scss']
})
export class ProjectSidebar {
  readonly projects = input.required<Project[]>();
  readonly selectedCategory = input.required<'all' | Project['category']>();
  readonly selectedProjectId = input.required<string>();

  readonly categorySelected = output<'all' | Project['category']>();
  readonly projectSelected = output<string>();

  readonly categories: Array<{ labelKey: string; value: 'all' | Project['category'] }> = [
    { labelKey: 'projects.categories.all', value: 'all' },
    { labelKey: 'projects.categories.frontend', value: 'frontend' },
    { labelKey: 'projects.categories.backend', value: 'backend' },
    { labelKey: 'projects.categories.fullstack', value: 'fullstack' },
    { labelKey: 'projects.categories.uiUx', value: 'ui-ux' }
  ];

  selectCategory(category: 'all' | Project['category']): void {
    if (!category) {
      console.warn('ProjectSidebar: empty category ignored.');
      return;
    }

    this.categorySelected.emit(category);
  }

  selectProject(projectId: string): void {
    if (!projectId) {
      console.warn('ProjectSidebar: empty projectId ignored.');
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
