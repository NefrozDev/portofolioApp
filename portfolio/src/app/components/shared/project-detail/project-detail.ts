import { Component, input } from '@angular/core';
import { Project } from '../../../../../../Common/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss']
})
export class ProjectDetail {
  readonly project = input.required<Project>();
}