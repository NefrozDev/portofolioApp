import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AppStateService } from './app-state';

describe('AppStateService', () => {
  const routerEvents = new Subject<NavigationEnd>();
  const rootRoute: { data: object; firstChild: ActivatedRouteSnapshot | null } = {
    data: {},
    firstChild: null
  };
  const router = {
    events: routerEvents,
    routerState: { snapshot: { root: rootRoute as unknown as ActivatedRouteSnapshot } }
  };

  beforeEach(() => {
    rootRoute.firstChild = null;
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
});
