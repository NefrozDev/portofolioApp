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
    technologies: ['Node.js', 'TypeScript', 'Docker'],
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

  it('should render an accessible skeleton while experiences are loading', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const loader = host.querySelector<HTMLElement>('.experience-loader');
    const skeletonCards = host.querySelectorAll('.experience-loader__card');

    expect(loader?.getAttribute('role')).toBe('status');
    expect(loader?.getAttribute('aria-busy')).toBe('true');
    expect(loader?.textContent).toContain('Loading experiences...');
    expect(skeletonCards.length).toBe(2);
    expect(host.querySelector('.experiences-page__toolbar')).toBeNull();
  });

  it('should expose sorted unique technology tags from the loaded experiences', () => {
    expect(component.availableTechnologyTags()).toEqual([
      'Angular',
      'Docker',
      'Node.js',
      'TypeScript'
    ]);
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

  it('should render technology filtering through the shared rail', () => {
    const rail = fixture.nativeElement.querySelector('app-filter-rail') as HTMLElement;

    expect(rail).not.toBeNull();
    expect(rail.querySelectorAll('button').length).toBe(5);
    expect(rail.querySelector('button')?.textContent?.trim()).toBe('All');
    const terms = Array.from(rail.querySelectorAll('app-info-term')).map(
      (term) => term.textContent
    );

    expect(terms.some((term) => term?.includes('Docker'))).toBeTrue();
  });
});
