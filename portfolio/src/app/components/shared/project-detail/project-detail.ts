import { Component, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Project } from '../../../../../../Common/models/project.model';
import { getGlossaryInfoKey } from '@common/constants/glossary';
import { InfoTerm } from '../info-term/info-term';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [InfoTerm, TranslatePipe],
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss']
})
export class ProjectDetail {
  readonly glossaryInfoKey = getGlossaryInfoKey;
  readonly project = input.required<Project>();
  readonly imageLoadFailed = signal(false);

  onImageLoad(): void {
    this.imageLoadFailed.set(false);
  }

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }
}
