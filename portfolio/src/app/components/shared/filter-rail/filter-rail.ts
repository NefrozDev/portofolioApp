import { Component, input, output, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { InfoTerm } from '../info-term/info-term';

export interface FilterRailOption {
  value: string;
  label?: string;
  labelKey?: string;
  infoKey?: string;
}

@Component({
  selector: 'app-filter-rail',
  standalone: true,
  imports: [InfoTerm, TranslatePipe],
  templateUrl: './filter-rail.html',
  styleUrls: ['./filter-rail.scss']
})
export class FilterRail {
  readonly labelKey = input.required<string>();
  readonly allLabelKey = input.required<string>();
  readonly options = input.required<readonly FilterRailOption[]>();
  readonly selectedValues = input<readonly string[]>([]);

  readonly allSelected = output<void>();
  readonly optionSelected = output<string>();

  readonly isDragging = signal(false);

  private readonly dragThresholdPx = 6;
  private activePointerId: number | null = null;
  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private suppressNextClick = false;

  isSelected(value: string): boolean {
    return this.selectedValues().includes(value);
  }

  selectAll(event: MouseEvent): void {
    if (!this.shouldSuppressClick(event)) {
      this.allSelected.emit();
    }
  }

  selectOption(event: MouseEvent, value: string): void {
    if (!this.shouldSuppressClick(event)) {
      this.optionSelected.emit(value);
    }
  }

  onWheel(event: WheelEvent): void {
    const rail = event.currentTarget as HTMLElement | null;

    if (!rail || rail.scrollWidth <= rail.clientWidth) {
      return;
    }

    const scrollDelta = event.deltaY || event.deltaX;

    if (!scrollDelta) {
      return;
    }

    event.preventDefault();
    rail.scrollLeft += scrollDelta;
  }

  onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;

    if (!rail) {
      return;
    }

    this.activePointerId = event.pointerId;
    this.dragStartX = event.clientX;
    this.dragStartScrollLeft = rail.scrollLeft;
    this.suppressNextClick = false;
    rail.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (this.activePointerId !== event.pointerId) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;

    if (!rail) {
      return;
    }

    const dragOffset = event.clientX - this.dragStartX;

    if (!this.isDragging() && Math.abs(dragOffset) < this.dragThresholdPx) {
      return;
    }

    this.suppressNextClick = true;
    this.isDragging.set(true);
    event.preventDefault();
    rail.scrollLeft = this.dragStartScrollLeft - dragOffset;
  }

  onPointerEnd(event: PointerEvent): void {
    if (this.activePointerId !== event.pointerId) {
      return;
    }

    const rail = event.currentTarget as HTMLElement | null;

    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }

    this.activePointerId = null;
    this.isDragging.set(false);

    window.setTimeout(() => {
      this.suppressNextClick = false;
    }, 0);
  }

  private shouldSuppressClick(event: MouseEvent): boolean {
    if (!this.suppressNextClick) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    this.suppressNextClick = false;

    return true;
  }
}
