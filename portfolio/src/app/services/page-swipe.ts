import {
  ComponentRef,
  DOCUMENT,
  EnvironmentInjector,
  Injectable,
  Injector,
  PLATFORM_ID,
  afterNextRender,
  createComponent,
  inject,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  ActivatedRouteSnapshot,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  ResolveEnd,
  Router
} from '@angular/router';

import { PageSkeleton } from '../components/shared/page-skeleton/page-skeleton';

// Order of the pages along the swipe axis; routes opt in with
// `data: { swipePage }`.
export const SWIPE_PAGES = ['experiences', 'projects', 'contact'] as const;
export type SwipePage = (typeof SWIPE_PAGES)[number];

interface Swipe {
  track: HTMLElement;
  skeletons: ComponentRef<PageSkeleton>[];
  // Where the new page starts, in page widths (negative when going back).
  offset: number;
  steps: number;
  animations: Animation[];
}

/**
 * Slides between swipeable pages like a carousel: the outgoing page (a
 * static copy, since the router removes the real one) leaves on one side
 * while the new page enters from the other. Pages skipped over in between
 * pass by as skeletons.
 */
@Injectable({
  providedIn: 'root'
})
export class PageSwipeService {
  static readonly STEP_DURATION_MS = 450;
  static readonly EASING = 'cubic-bezier(0.65, 0, 0.35, 1)';
  // Easings of each page crossed in a multi-page swipe. Each segment leaves
  // and reaches the skipped pages at about a third of its average speed, so
  // the swipe slows down on them without stopping, and the speed stays
  // continuous from one segment to the next.
  static readonly FIRST_STEP_EASING = 'cubic-bezier(0.5, 0, 0.65, 0.88)';
  static readonly MIDDLE_STEP_EASING = 'cubic-bezier(0.35, 0.12, 0.65, 0.88)';
  static readonly LAST_STEP_EASING = 'cubic-bezier(0.35, 0.12, 0.5, 1)';

  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private viewport?: HTMLElement;
  private page?: HTMLElement;
  private swipe?: Swipe;
  private readonly swipingState = signal(false);

  /**
   * True from just before the page changes until the new page has settled.
   * Pages start their entrance animations once it is false again.
   */
  readonly isSwiping = this.swipingState.asReadonly();

  /** `page` wraps the router outlet; `viewport` clips the panels around it. */
  attach(viewport: HTMLElement, page: HTMLElement): void {
    if (!this.isBrowser || this.page) {
      return;
    }

    this.viewport = viewport;
    this.page = page;

    this.router.events.subscribe((event) => {
      if (event instanceof ResolveEnd) {
        this.prepare(this.router.routerState.snapshot.root, event.state.root);
      } else if (event instanceof NavigationEnd) {
        this.playAfterRender();
      } else if (
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof NavigationSkipped
      ) {
        this.cleanUp();
      }
    });
  }

  static getDuration(steps: number): number {
    return PageSwipeService.STEP_DURATION_MS * steps;
  }

  /**
   * Keyframes moving from `from` to `to` page widths, with one segment per
   * page crossed so the swipe can slow down on each skipped page.
   */
  static getKeyframes(from: number, to: number, steps: number): Keyframe[] {
    if (steps <= 1) {
      return [
        { transform: `translateX(${from * 100}%)` },
        { transform: `translateX(${to * 100}%)` }
      ];
    }

    return Array.from({ length: steps + 1 }, (_, step) => ({
      offset: step / steps,
      transform: `translateX(${(from + ((to - from) * step) / steps) * 100}%)`,
      easing: step === 0
        ? PageSwipeService.FIRST_STEP_EASING
        : step === steps - 1
          ? PageSwipeService.LAST_STEP_EASING
          : PageSwipeService.MIDDLE_STEP_EASING
    }));
  }

  // Runs while the outgoing page is still in the DOM.
  private prepare(from: ActivatedRouteSnapshot, to: ActivatedRouteSnapshot): void {
    this.cleanUp();

    const fromIndex = this.getSwipeIndex(from);
    const toIndex = this.getSwipeIndex(to);

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex || this.prefersReducedMotion()) {
      return;
    }

    const page = this.page!;
    const direction = Math.sign(toIndex - fromIndex);
    const steps = Math.abs(toIndex - fromIndex);
    const track = this.document.createElement('div');
    const outgoingPage = page.cloneNode(true) as HTMLElement;
    const skeletons: ComponentRef<PageSkeleton>[] = [];

    track.className = 'page-swipe__track';
    track.setAttribute('aria-hidden', 'true');
    track.inert = true;
    track.style.height = `${page.offsetHeight}px`;
    // The copy is a still image of the page: its animations stay off.
    outgoingPage.classList.add('page-swipe__snapshot');
    track.append(this.toPanel(outgoingPage, 0));

    for (let step = 1; step < steps; step++) {
      const skeleton = createComponent(PageSkeleton, {
        environmentInjector: this.environmentInjector
      });

      skeleton.setInput('page', SWIPE_PAGES[fromIndex + direction * step]);
      skeleton.changeDetectorRef.detectChanges();
      track.append(this.toPanel(skeleton.location.nativeElement, direction * step));
      skeletons.push(skeleton);
    }

    this.viewport!.append(track);
    // Keep the incoming page off-screen until the slide starts, with its CSS
    // animations paused until it has settled.
    page.style.transform = `translateX(${direction * steps * 100}%)`;
    page.classList.add('page-swipe__incoming');
    this.swipe = { track, skeletons, offset: direction * steps, steps, animations: [] };
    this.swipingState.set(true);
  }

  private playAfterRender(): void {
    if (!this.swipe) {
      return;
    }

    afterNextRender(() => this.play(), { injector: this.injector });
  }

  private play(): void {
    const swipe = this.swipe;
    const page = this.page!;

    if (!swipe || swipe.animations.length) {
      return;
    }

    const { offset, steps } = swipe;
    const options: KeyframeAnimationOptions = {
      duration: PageSwipeService.getDuration(steps),
      // Multi-page swipes carry their easing on each keyframe segment.
      easing: steps > 1 ? 'linear' : PageSwipeService.EASING,
      fill: 'both'
    };

    page.style.transform = '';
    swipe.animations = [
      swipe.track.animate(PageSwipeService.getKeyframes(0, -offset, steps), options),
      page.animate(PageSwipeService.getKeyframes(offset, 0, steps), options)
    ];

    Promise.all(swipe.animations.map((animation) => animation.finished))
      .then(() => {
        if (this.swipe === swipe) {
          this.cleanUp();
        }
      })
      .catch(() => {
        // Cancelled by a newer navigation, which already cleaned up.
      });
  }

  private cleanUp(): void {
    const swipe = this.swipe;

    if (!swipe) {
      return;
    }

    this.swipe = undefined;
    // Cancelling also drops the fill, so the page keeps no transform (which
    // would otherwise turn it into the containing block of fixed elements).
    swipe.animations.forEach((animation) => animation.cancel());
    swipe.track.remove();
    swipe.skeletons.forEach((skeleton) => skeleton.destroy());
    this.page!.style.transform = '';
    this.page!.classList.remove('page-swipe__incoming');
    this.swipingState.set(false);
  }

  private toPanel(element: HTMLElement, offset: number): HTMLElement {
    element.classList.add('page-swipe__panel');
    element.style.left = `${offset * 100}%`;

    return element;
  }

  private getSwipeIndex(root: ActivatedRouteSnapshot): number {
    let route = root;

    while (route.firstChild) {
      route = route.firstChild;
    }

    return SWIPE_PAGES.indexOf(route.data['swipePage']);
  }

  private prefersReducedMotion(): boolean {
    return typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
