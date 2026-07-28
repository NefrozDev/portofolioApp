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
    const shouldOpen = !this.isOpen();

    this.isOpen.set(shouldOpen);

    if (shouldOpen) {
      this.showTooltip();
      this.positionTooltip();
    } else {
      this.hideTooltip();
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.hideTooltip();
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
    this.showTooltip();
    this.positionTooltip();
  }

  onPointerLeave(): void {
    if (!this.isOpen()) {
      this.hideTooltip();
    }
  }

  @HostListener('document:focusin', ['$event'])
  onDocumentFocusIn(event: FocusEvent): void {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const host = this.elementRef.nativeElement;
    const interactsWithHost = host.contains(target) || target.contains(host);

    if (interactsWithHost) {
      this.showTooltip();
      this.positionTooltip();
    } else if (!this.isOpen()) {
      this.hideTooltip();
    }
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  repositionOpenTooltip(): void {
    if (
      this.isOpen() ||
      this.tooltip().nativeElement.matches(':popover-open')
    ) {
      this.positionTooltip();
    }
  }

  private positionTooltip(): void {
    const bounds = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipBounds = this.tooltip().nativeElement.getBoundingClientRect();
    const fallbackWidth = this.embedded() ? 224 : 288;
    const tooltipWidth =
      tooltipBounds.width || Math.min(fallbackWidth, window.innerWidth - 32);
    const tooltipHeight = tooltipBounds.height;
    const minimumLeft = tooltipWidth / 2 + 8;
    const maximumLeft = window.innerWidth - tooltipWidth / 2 - 8;
    const centeredLeft = bounds.left + bounds.width / 2;
    const belowTop = bounds.bottom + 8;
    const aboveTop = bounds.top - tooltipHeight - 8;
    const fitsBelow = belowTop + tooltipHeight <= window.innerHeight - 8;
    const fitsAbove = aboveTop >= 8;
    const preferredTop = fitsBelow || !fitsAbove ? belowTop : aboveTop;
    const maximumTop = Math.max(8, window.innerHeight - tooltipHeight - 8);

    this.tooltipLeft.set(
      Math.min(Math.max(centeredLeft, minimumLeft), maximumLeft)
    );
    this.tooltipTop.set(Math.min(Math.max(preferredTop, 8), maximumTop));
  }

  private showTooltip(): void {
    const tooltip = this.tooltip().nativeElement;

    if (!tooltip.matches(':popover-open')) {
      tooltip.showPopover();
    }
  }

  private hideTooltip(): void {
    const tooltip = this.tooltip().nativeElement;

    if (tooltip.matches(':popover-open')) {
      tooltip.hidePopover();
    }
  }
}
