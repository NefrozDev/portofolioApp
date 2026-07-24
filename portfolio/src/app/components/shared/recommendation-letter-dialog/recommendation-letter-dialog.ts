import {
  Component,
  ElementRef,
  computed,
  inject,
  input,
  viewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

import { Experience } from '@common/models/experience.model';

@Component({
  selector: 'app-recommendation-letter-dialog',
  imports: [TranslatePipe],
  templateUrl: './recommendation-letter-dialog.html',
  styleUrl: './recommendation-letter-dialog.scss'
})
export class RecommendationLetterDialog {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dialog =
    viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  readonly experience = input.required<Experience>();
  readonly safeLetterUrl = computed(() => {
    const url = this.experience().recommendationLetterUrl;

    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  });

  open(): void {
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
