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
  readonly selectedProjectId = input.required<string>();

  readonly projectSelected = output<string>();

  selectProject(projectId: string): void {
    if (!projectId) {
      console.warn('ProjectSidebar: empty projectId ignored.');
      return;
    }

    this.projectSelected.emit(projectId);
  }

  isProjectActive(projectId: string): boolean {
    return this.selectedProjectId() === projectId;
  }
}
