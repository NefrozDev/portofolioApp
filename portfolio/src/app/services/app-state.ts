import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface AppRouteState {
  showSiteHeader?: boolean;
}

// Navigation state flag set by the home page after its exit animation, so
// the next page can play its arrival animation.
export const ARRIVED_FROM_HOME_STATE = 'arrivedFromHome';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly siteHeaderVisibleState = signal(true);
  private readonly arrivedFromHomeState = signal(false);

  readonly siteHeaderVisible = this.siteHeaderVisibleState.asReadonly();
  readonly arrivedFromHome = this.arrivedFromHomeState.asReadonly();

  constructor() {
    this.updateRouteState();

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updateRouteState());
  }

  private updateRouteState(): void {
    const route = this.getActiveRoute(this.router.routerState.snapshot.root);
    const state = route.data as AppRouteState;

    this.siteHeaderVisibleState.set(state.showSiteHeader !== false);
    this.arrivedFromHomeState.set(
      this.router.lastSuccessfulNavigation?.extras.state?.[ARRIVED_FROM_HOME_STATE] === true
    );
  }

  private getActiveRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let activeRoute = route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    return activeRoute;
  }
}
