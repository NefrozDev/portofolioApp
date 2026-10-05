import { TestBed } from '@angular/core/testing';

import { SWIPE_PAGES, SwipePage } from '../../../services/page-swipe';
import { PageSkeleton } from './page-skeleton';

describe('PageSkeleton', () => {
  function render(page: SwipePage): HTMLElement {
    const fixture = TestBed.createComponent(PageSkeleton);
    fixture.componentRef.setInput('page', page);
    fixture.detectChanges();

    return fixture.nativeElement as HTMLElement;
  }

  it('should be hidden from assistive technology', () => {
    expect(render('projects').getAttribute('aria-hidden')).toBe('true');
  });

  it('should draw a hero placeholder for every swipeable page', () => {
    for (const page of SWIPE_PAGES) {
      expect(render(page).querySelector('.page-skeleton__title'))
        .withContext(page)
        .toBeTruthy();
    }
  });

  it('should mirror the projects page filters, project list and selected project', () => {
    const host = render('projects');

    expect(host.querySelectorAll('.page-skeleton__rail').length).toBe(2);
    expect(host.querySelectorAll('.page-skeleton__rail-label').length).toBe(2);
    expect(host.querySelectorAll('.page-skeleton__arrow').length).toBe(4);
    expect(host.querySelectorAll('.page-skeleton__sidebar .page-skeleton__item').length).toBe(4);
    expect(host.querySelector('.page-skeleton__detail .page-skeleton__preview')).toBeTruthy();
    expect(host.querySelectorAll('.page-skeleton__tag-group').length).toBe(2);
    expect(host.querySelectorAll('.page-skeleton__action').length).toBe(2);
  });

  it('should size each filter chip like the real one', () => {
    const chip = render('projects').querySelector<HTMLElement>('.page-skeleton__chip');

    expect(chip?.style.getPropertyValue('--chip-width')).toBe('2.9rem');
  });

  it('should fall back to a generic card for pages without a detailed placeholder', () => {
    const host = render('contact');

    expect(host.querySelector('.page-skeleton__card')).toBeTruthy();
    expect(host.querySelector('.page-skeleton__rail')).toBeNull();
  });
});
