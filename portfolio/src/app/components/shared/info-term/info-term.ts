import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-info-term',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './info-term.html',
  styleUrl: './info-term.scss'
})
export class InfoTerm {
  private static nextTooltipId = 0;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly tooltip = viewChild.required<ElementRef<HTMLElement>>('tooltip');

  readonly label = input.required<string>();
  readonly descriptionKey = input.required<string>();
  readonly embedded = input(false);
  readonly isOpen = signal(false);
  readonly tooltipLeft = signal(0);
  readonly tooltipTop = signal(0);
  readonly tooltipId = `info-term-tooltip-${InfoTerm.nextTooltipId++}`;

  toggle(): void {
    this.positionEmbeddedTooltip();
    this.isOpen.update((isOpen) => !isOpen);

    if (this.isOpen()) {
      this.showEmbeddedTooltip();
    } else {
      this.hideEmbeddedTooltip();
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.hideEmbeddedTooltip();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  onPointerEnter(): void {
    this.positionEmbeddedTooltip();
    this.showEmbeddedTooltip();
  }

  onPointerLeave(): void {
    if (!this.isOpen()) {
      this.hideEmbeddedTooltip();
    }
  }

  @HostListener('document:focusin', ['$event'])
  onDocumentFocusIn(event: FocusEvent): void {
    const target = event.target;

    if (
      this.embedded() &&
      target instanceof HTMLElement &&
      target.contains(this.elementRef.nativeElement)
    ) {
      this.positionEmbeddedTooltip();
      this.showEmbeddedTooltip();
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  repositionOpenTooltip(): void {
    if (this.isOpen()) {
      this.positionEmbeddedTooltip();
    }
  }

  private positionEmbeddedTooltip(): void {
    if (!this.embedded()) {
      return;
    }

    const bounds = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipWidth = Math.min(224, window.innerWidth - 32);
    const minimumLeft = tooltipWidth / 2 + 8;
    const maximumLeft = window.innerWidth - tooltipWidth / 2 - 8;
    const centeredLeft = bounds.left + bounds.width / 2;

    this.tooltipLeft.set(
      Math.min(Math.max(centeredLeft, minimumLeft), maximumLeft)
    );
    this.tooltipTop.set(bounds.bottom + 8);
  }

  private showEmbeddedTooltip(): void {
    if (!this.embedded()) {
      return;
    }

    const tooltip = this.tooltip().nativeElement;

    if (!tooltip.matches(':popover-open')) {
      tooltip.showPopover();
    }
  }

  private hideEmbeddedTooltip(): void {
    if (!this.embedded()) {
      return;
    }

    const tooltip = this.tooltip().nativeElement;

    if (tooltip.matches(':popover-open')) {
      tooltip.hidePopover();
    }
  }
}
