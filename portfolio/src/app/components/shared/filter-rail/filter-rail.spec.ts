import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { FilterRail } from './filter-rail';

describe('FilterRail', () => {
  let component: FilterRail;
  let fixture: ComponentFixture<FilterRail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterRail],
      providers: [...provideTestI18n()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterRail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('labelKey', 'projects.tagLabel');
    fixture.componentRef.setInput('allLabelKey', 'projects.categories.all');
    fixture.componentRef.setInput('options', [
      { value: 'Angular', label: 'Angular' },
      { value: 'design', labelKey: 'projects.tags.design' }
    ]);
    fixture.componentRef.setInput('selectedValues', ['design']);
    fixture.detectChanges();
  });

  it('should render literal and translated options with their selection state', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent?.trim()).toBe('All');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].textContent?.trim()).toBe('Angular');
    expect(buttons[2].textContent?.trim()).toBe('Design');
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
  });

  it('should emit selected options and the All action', () => {
    const optionSelected = jasmine.createSpy('optionSelected');
    const allSelected = jasmine.createSpy('allSelected');
    component.optionSelected.subscribe(optionSelected);
    component.allSelected.subscribe(allSelected);

    component.selectOption(new MouseEvent('click'), 'Angular');
    component.selectAll(new MouseEvent('click'));

    expect(optionSelected).toHaveBeenCalledOnceWith('Angular');
    expect(allSelected).toHaveBeenCalledTimes(1);
  });

  it('should translate vertical wheel movement into horizontal scrolling', () => {
    const rail = { clientWidth: 100, scrollLeft: 10, scrollWidth: 300 } as HTMLElement;
    const preventDefault = jasmine.createSpy('preventDefault');

    component.onWheel({
      currentTarget: rail,
      deltaX: 0,
      deltaY: 40,
      preventDefault
    } as unknown as WheelEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(rail.scrollLeft).toBe(50);
  });

  it('should suppress a chip selection after dragging the rail', () => {
    const rail = {
      scrollLeft: 20,
      setPointerCapture: jasmine.createSpy('setPointerCapture'),
      hasPointerCapture: jasmine.createSpy('hasPointerCapture').and.returnValue(true),
      releasePointerCapture: jasmine.createSpy('releasePointerCapture')
    } as unknown as HTMLElement;
    const optionSelected = jasmine.createSpy('optionSelected');
    const preventClickDefault = jasmine.createSpy('preventClickDefault');
    const stopClickPropagation = jasmine.createSpy('stopClickPropagation');
    component.optionSelected.subscribe(optionSelected);

    component.onPointerDown({
      currentTarget: rail,
      pointerId: 1,
      button: 0,
      clientX: 100
    } as unknown as PointerEvent);
    component.onPointerMove({
      currentTarget: rail,
      pointerId: 1,
      clientX: 70,
      preventDefault: jasmine.createSpy('preventMoveDefault')
    } as unknown as PointerEvent);
    component.onPointerEnd({ currentTarget: rail, pointerId: 1 } as unknown as PointerEvent);
    component.selectOption({
      preventDefault: preventClickDefault,
      stopPropagation: stopClickPropagation
    } as unknown as MouseEvent, 'Angular');

    expect(rail.scrollLeft).toBe(50);
    expect(component.isDragging()).toBeFalse();
    expect(preventClickDefault).toHaveBeenCalled();
    expect(stopClickPropagation).toHaveBeenCalled();
    expect(optionSelected).not.toHaveBeenCalled();
  });
});
