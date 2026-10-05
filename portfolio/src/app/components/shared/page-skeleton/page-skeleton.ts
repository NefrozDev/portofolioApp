import { Component, input } from '@angular/core';

import type { SwipePage } from '../../../services/page-swipe';

/**
 * Decorative placeholder of a page, shown for the pages skipped over
 * during a swipe transition. Projects is the only page between two others,
 * so it is the only one with a detailed layout; widths follow its real
 * filters and content.
 */
@Component({
  selector: 'app-page-skeleton',
  standalone: true,
  templateUrl: './page-skeleton.html',
  styleUrl: './page-skeleton.scss',
  host: { 'aria-hidden': 'true' }
})
export class PageSkeleton {
  readonly page = input.required<SwipePage>();

  // Chip widths (rem) of the category and tag rails.
  readonly filterRails = [
    [2.9, 5.6, 5.5, 5.7, 4.6, 4.6, 7.5, 5.1],
    [2.9, 7.1, 7, 4.2, 8.3, 4.7, 8.2, 9.4, 7.2]
  ];
  // Title and technology line widths (rem) of each project in the list.
  readonly projectItems = [[4.5, 6], [6, 5.5], [6.5, 6], [7.5, 5.5]];
  // Technology and tag widths (rem) of the selected project.
  readonly detailTagGroups = [
    [4.2, 5.2, 4.1, 4.6, 5.9],
    [5.3, 3.4, 5.8, 8, 6.1, 5.3, 3.3]
  ];
}
