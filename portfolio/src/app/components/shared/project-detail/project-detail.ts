import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Project } from '../../../../../../Common/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss']
})
export class ProjectDetail {
  readonly project = input.required<Project>();
}
