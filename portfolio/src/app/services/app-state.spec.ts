import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { ARRIVED_FROM_HOME_STATE, AppStateService } from './app-state';

describe('AppStateService', () => {
  const routerEvents = new Subject<NavigationEnd>();
  const rootRoute: { data: object; firstChild: ActivatedRouteSnapshot | null } = {
    data: {},
    firstChild: null
  };
  const router: {
    events: Subject<NavigationEnd>;
    routerState: { snapshot: { root: ActivatedRouteSnapshot } };
    lastSuccessfulNavigation: { extras: { state?: Record<string, unknown> } } | null;
  } = {
    events: routerEvents,
    routerState: { snapshot: { root: rootRoute as unknown as ActivatedRouteSnapshot } },
    lastSuccessfulNavigation: null
  };

  beforeEach(() => {
    rootRoute.firstChild = null;
    router.lastSuccessfulNavigation = null;
    TestBed.configureTestingModule({
      providers: [
        AppStateService,
        { provide: Router, useValue: router }
      ]
    });
  });

  it('shows the site header by default', () => {
    const service = TestBed.inject(AppStateService);

    expect(service.siteHeaderVisible()).toBeTrue();
  });

  it('uses the deepest active route state to control the site header', () => {
    const service = TestBed.inject(AppStateService);
    rootRoute.firstChild = {
      data: {},
      firstChild: {
        data: { showSiteHeader: false },
        firstChild: null
      }
    } as unknown as ActivatedRouteSnapshot;

    routerEvents.next(new NavigationEnd(1, '/en', '/en'));

    expect(service.siteHeaderVisible()).toBeFalse();
  });

  it('reports an arrival from the home page only for the navigation that carries the flag', () => {
    const service = TestBed.inject(AppStateService);

    router.lastSuccessfulNavigation = { extras: { state: { [ARRIVED_FROM_HOME_STATE]: true } } };
    routerEvents.next(new NavigationEnd(1, '/fr/experiences', '/fr/experiences'));

    expect(service.arrivedFromHome()).toBeTrue();

    router.lastSuccessfulNavigation = { extras: {} };
    routerEvents.next(new NavigationEnd(2, '/fr/projects', '/fr/projects'));

    expect(service.arrivedFromHome()).toBeFalse();
  });
});
