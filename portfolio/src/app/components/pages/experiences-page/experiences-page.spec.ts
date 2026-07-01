import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Experience } from '../../../../../../Common/models/experience.model';
import { ExperiencesApi } from '../../../services/api/experiences-api';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ExperiencesPage } from './experiences-page';

const experiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Company',
    role: 'Developer',
    period: '2024 - Present',
    technologies: ['Angular', 'TypeScript'],
    highlights: ['Built UI'],
    isExpanded: true
  },
  {
    id: 'exp-2',
    company: 'Other Company',
    role: 'Backend Developer',
    period: '2023 - 2024',
    technologies: ['Node.js', 'TypeScript'],
    highlights: ['Built API'],
    isExpanded: false
  }
];

describe('ExperiencesPage', () => {
  let component: ExperiencesPage;
  let fixture: ComponentFixture<ExperiencesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperiencesPage],
      providers: [
        ...provideTestI18n(),
        {
          provide: ExperiencesApi,
          useValue: {
            getExperiences: () => of(experiences)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperiencesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose sorted unique technology tags from the loaded experiences', () => {
    expect(component.availableTechnologyTags()).toEqual(['Angular', 'Node.js', 'TypeScript']);
  });

  it('should filter experiences by selected technology tags', () => {
    component.toggleTechnologyFilter('Angular');

    expect(component.filteredExperiences().map((experience) => experience.id)).toEqual(['exp-1']);
  });

  it('should show experiences matching any selected technology tag', () => {
    component.toggleTechnologyFilter('Angular');
    component.toggleTechnologyFilter('Node.js');

    expect(component.filteredExperiences().map((experience) => experience.id)).toEqual(['exp-1', 'exp-2']);
  });

  it('should clear technology filters', () => {
    component.toggleTechnologyFilter('Angular');
    component.clearTechnologyFilters();

    expect(component.selectedTechnologyTags()).toEqual([]);
    expect(component.filteredExperiences()).toEqual(experiences);
  });

  it('should scroll the technology filter rail with vertical wheel movement', () => {
    const rail = {
      clientWidth: 100,
      scrollLeft: 10,
      scrollWidth: 300
    } as HTMLElement;
    const preventDefault = jasmine.createSpy('preventDefault');

    component.onTechnologyTagRailWheel({
      currentTarget: rail,
      deltaX: 0,
      deltaY: 40,
      preventDefault
    } as unknown as WheelEvent);

    expect(preventDefault).toHaveBeenCalled();
    expect(rail.scrollLeft).toBe(50);
  });

  it('should drag the technology filter rail without toggling a chip', () => {
    const rail = {
      scrollLeft: 20,
      setPointerCapture: jasmine.createSpy('setPointerCapture'),
      releasePointerCapture: jasmine.createSpy('releasePointerCapture')
    } as unknown as HTMLElement & {
      setPointerCapture: jasmine.Spy;
      releasePointerCapture: jasmine.Spy;
    };
    const preventMoveDefault = jasmine.createSpy('preventMoveDefault');
    const preventClickDefault = jasmine.createSpy('preventClickDefault');
    const stopClickPropagation = jasmine.createSpy('stopClickPropagation');

    component.onTechnologyTagRailPointerDown({
      currentTarget: rail,
      pointerId: 1,
      button: 0,
      clientX: 100
    } as unknown as PointerEvent);

    component.onTechnologyTagRailPointerMove({
      currentTarget: rail,
      pointerId: 1,
      clientX: 70,
      preventDefault: preventMoveDefault
    } as unknown as PointerEvent);

    component.onTechnologyTagRailPointerEnd({
      currentTarget: rail,
      pointerId: 1
    } as unknown as PointerEvent);

    component.toggleTechnologyFilterFromClick({
      preventDefault: preventClickDefault,
      stopPropagation: stopClickPropagation
    } as unknown as MouseEvent, 'Angular');

    expect(rail.setPointerCapture).toHaveBeenCalledWith(1);
    expect(rail.releasePointerCapture).toHaveBeenCalledWith(1);
    expect(preventMoveDefault).toHaveBeenCalled();
    expect(preventClickDefault).toHaveBeenCalled();
    expect(stopClickPropagation).toHaveBeenCalled();
    expect(rail.scrollLeft).toBe(50);
    expect(component.isTechnologyTagRailDragging()).toBeFalse();
    expect(component.selectedTechnologyTags()).toEqual([]);
  });
});
