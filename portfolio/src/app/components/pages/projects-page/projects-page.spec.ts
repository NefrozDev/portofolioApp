import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { of } from 'rxjs';

import { Project } from '../../../../../../Common/models/project.model';
import { ProjectsApi } from '../../../services/api/projects-api';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ProjectsPage } from './projects-page';

const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Portfolio App',
    shortLabel: 'Portfolio',
    category: 'fullstack',
    description: 'Personal portfolio application.',
    imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    technologies: ['Angular'],
    tags: ['documentation', 'design'],
    sourceUrl: '#',
    demoUrl: '#'
  },
  {
    id: 'project-2',
    title: 'Dashboard',
    shortLabel: 'Dashboard',
    category: 'frontend',
    description: 'Performance dashboard.',
    imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    technologies: ['Angular', 'RxJS'],
    tags: ['performance', 'design']
  },
  {
    id: 'project-3',
    title: 'Monitor',
    shortLabel: 'Monitor',
    category: 'backend',
    description: 'Backend monitoring service.',
    imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    technologies: ['Node.js'],
    tags: ['architecture', 'performance']
  }
];

describe('ProjectsPage', () => {
  let component: ProjectsPage;
  let fixture: ComponentFixture<ProjectsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsPage],
      providers: [
        ...provideTestI18n(),
        {
          provide: ProjectsApi,
          useValue: {
            getProjects: () => of(projects)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the tags available in the loaded projects', () => {
    expect(component.availableTags()).toEqual([
      'architecture',
      'design',
      'documentation',
      'performance'
    ]);
  });

  it('should combine a category with any selected project tag', fakeAsync(() => {
    component.selectCategory('backend');
    component.toggleTag('documentation');
    tick(120);

    expect(component.filteredProjects()).toEqual([]);
    expect(component.selectedProject()).toBeNull();

    component.toggleTag('performance');
    tick(120);

    expect(component.filteredProjects().map((project) => project.id)).toEqual([
      'project-3'
    ]);
    expect(component.selectedProject()?.id).toBe('project-3');
  }));

  it('should debounce rapid tag changes into one applied selection', fakeAsync(() => {
    component.toggleTag('documentation');
    component.toggleTag('design');

    expect(component.selectedTags()).toEqual(['documentation', 'design']);
    expect(component.appliedTags()).toEqual([]);
    expect(component.filteredProjects()).toEqual(projects);

    tick(119);
    expect(component.appliedTags()).toEqual([]);

    tick(1);
    expect(component.appliedTags()).toEqual(['documentation', 'design']);
    expect(component.filteredProjects().map((project) => project.id)).toEqual([
      'project-1',
      'project-2'
    ]);
  }));

  it('should clear category and tag filters together', () => {
    component.selectCategory('frontend');
    component.toggleTag('performance');
    component.clearFilters();

    expect(component.selectedCategory()).toBe('all');
    expect(component.selectedTags()).toEqual([]);
    expect(component.filteredProjects()).toEqual(projects);
  });

  it('should clear only tags when selecting the tags All option', fakeAsync(() => {
    component.selectCategory('frontend');
    component.toggleTag('performance');
    tick(120);

    component.clearTags();

    expect(component.selectedCategory()).toBe('frontend');
    expect(component.selectedTags()).toEqual([]);
    expect(component.appliedTags()).toEqual([]);
    expect(component.filteredProjects().map((project) => project.id)).toEqual([
      'project-2'
    ]);
  }));

  it('should render category and project tag filters above the layout', () => {
    const host = fixture.nativeElement as HTMLElement;
    const filterRows = host.querySelectorAll('.projects-page__filter-row');
    const tagFilters = host.querySelectorAll<HTMLButtonElement>(
      '.projects-page__filter-chip--tag'
    );

    expect(filterRows.length).toBe(2);
    expect(filterRows[0].querySelectorAll('button').length).toBe(8);
    expect(tagFilters.length).toBe(5);
    expect(tagFilters[0].textContent?.trim()).toBe('All');
    expect(tagFilters[0].getAttribute('aria-pressed')).toBe('true');
  });
});
