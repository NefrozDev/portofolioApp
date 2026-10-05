import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { PageSwipeService } from './page-swipe';

@Component({ template: '<p>page</p>' })
class FakePage {}

describe('PageSwipeService', () => {
  let viewport: HTMLElement;
  let page: HTMLElement;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'home', component: FakePage },
          { path: 'experiences', component: FakePage, data: { swipePage: 'experiences' } },
          { path: 'projects', component: FakePage, data: { swipePage: 'projects' } },
          { path: 'contact', component: FakePage, data: { swipePage: 'contact' } }
        ])
      ]
    });

    viewport = document.createElement('div');
    page = document.createElement('div');
    page.textContent = 'current page';
    viewport.append(page);
    document.body.append(viewport);

    TestBed.inject(PageSwipeService).attach(viewport, page);
    harness = await RouterTestingHarness.create();
  });

  afterEach(() => {
    viewport.remove();
  });

  const track = () => viewport.querySelector<HTMLElement>('.page-swipe__track');
  const panels = () => Array.from(track()?.querySelectorAll<HTMLElement>(':scope > .page-swipe__panel') ?? []);

  it('should slide past a skeleton of each page skipped over', async () => {
    await harness.navigateByUrl('/experiences');
    await harness.navigateByUrl('/contact');

    expect(panels().map((panel) => panel.style.left)).toEqual(['0%', '100%']);
    expect(panels()[0].textContent).toContain('current page');
    expect(panels()[1].tagName.toLowerCase()).toBe('app-page-skeleton');
    expect(panels()[1].querySelector('.page-skeleton__projects')).toBeTruthy();
    expect(getTransform(page.getAnimations()[0], 0)).toBe('translateX(200%)');
  });

  it('should slide the outgoing page and the new page together, then clean up', async () => {
    await harness.navigateByUrl('/experiences');
    await harness.navigateByUrl('/contact');
    TestBed.tick();

    const [trackAnimation] = track()!.getAnimations();
    const [pageAnimation] = page.getAnimations();
    const duration = PageSwipeService.getDuration(2);

    expect(trackAnimation.effect?.getTiming().duration).toBe(duration);
    expect(pageAnimation.effect?.getTiming().duration).toBe(duration);
    expect(getTransform(trackAnimation, -1)).toBe('translateX(-200%)');
    expect(getTransform(pageAnimation, -1)).toMatch(/^translateX\(0(px|%)?\)$/);

    trackAnimation.finish();
    pageAnimation.finish();
    await new Promise((resolve) => setTimeout(resolve));

    expect(track()).toBeNull();
    expect(page.style.transform).toBe('');
    expect(page.getAnimations().length).toBe(0);
  });

  it('should slide the other way when going back', async () => {
    await harness.navigateByUrl('/contact');
    await harness.navigateByUrl('/projects');

    TestBed.tick();

    expect(panels().length).toBe(1);
    expect(getTransform(page.getAnimations()[0], 0)).toBe('translateX(-100%)');
    expect(getTransform(track()!.getAnimations()[0], -1)).toBe('translateX(100%)');
  });

  it('should not swipe to or from pages outside the swipe order', async () => {
    await harness.navigateByUrl('/home');
    await harness.navigateByUrl('/experiences');

    expect(track()).toBeNull();
    expect(page.style.transform).toBe('');
  });

  it('should not swipe when reduced motion is preferred', async () => {
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);

    await harness.navigateByUrl('/experiences');
    await harness.navigateByUrl('/projects');

    expect(track()).toBeNull();
  });

  it('should give each page crossed the same time as a single swipe', () => {
    expect(PageSwipeService.getDuration(1)).toBe(PageSwipeService.STEP_DURATION_MS);
    expect(PageSwipeService.getDuration(2)).toBe(PageSwipeService.STEP_DURATION_MS * 2);
  });

  it('should ease a single-page swipe as one movement', async () => {
    await harness.navigateByUrl('/experiences');
    await harness.navigateByUrl('/projects');
    TestBed.tick();

    const [animation] = page.getAnimations();

    expect(animation.effect?.getTiming().easing).toBe(PageSwipeService.EASING);
    expect((animation.effect as KeyframeEffect).getKeyframes().length).toBe(2);
  });

  it('should slow down on each skipped page of a multi-page swipe', async () => {
    await harness.navigateByUrl('/experiences');
    await harness.navigateByUrl('/contact');
    TestBed.tick();

    const [animation] = track()!.getAnimations();
    const keyframes = (animation.effect as KeyframeEffect).getKeyframes();

    expect(animation.effect?.getTiming().easing).toBe('linear');
    expect(keyframes.map((keyframe) => keyframe.computedOffset)).toEqual([0, 0.5, 1]);
    expect(keyframes[1]['transform']).toBe('translateX(-100%)');
    expect(keyframes[0].easing).toBe(PageSwipeService.FIRST_STEP_EASING);
    expect(keyframes[1].easing).toBe(PageSwipeService.LAST_STEP_EASING);
  });

  it('should keep the speed continuous and reduced where segments meet', () => {
    const { start: firstStart, end: firstEnd } = getSlopes(PageSwipeService.FIRST_STEP_EASING);
    const middle = getSlopes(PageSwipeService.MIDDLE_STEP_EASING);
    const { start: lastStart, end: lastEnd } = getSlopes(PageSwipeService.LAST_STEP_EASING);

    expect(firstStart).toBe(0);
    expect(lastEnd).toBe(0);
    expect(middle.start).toBeCloseTo(firstEnd, 2);
    expect(lastStart).toBeCloseTo(firstEnd, 2);
    expect(middle.end).toBeCloseTo(lastStart, 2);
    expect(firstEnd).toBeGreaterThan(0.2);
    expect(firstEnd).toBeLessThan(0.5);
  });
});

// Start and end speed of a cubic-bezier easing, relative to its average speed.
function getSlopes(easing: string): { start: number; end: number } {
  const [x1, y1, x2, y2] = easing.match(/[\d.]+/g)!.map(Number);

  return { start: x1 ? y1 / x1 : 0, end: (1 - y2) / (1 - x2) };
}

function getTransform(animation: Animation | undefined, keyframe: number): string | undefined {
  const keyframes = (animation?.effect as KeyframeEffect | undefined)?.getKeyframes() ?? [];

  return keyframes.at(keyframe)?.['transform'] as string | undefined;
}
