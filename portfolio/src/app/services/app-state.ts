import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface AppRouteState {
  showSiteHeader?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly siteHeaderVisibleState = signal(true);

  readonly siteHeaderVisible = this.siteHeaderVisibleState.asReadonly();

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
  }

  private getActiveRoute(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
    let activeRoute = route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    return activeRoute;
  }
}
