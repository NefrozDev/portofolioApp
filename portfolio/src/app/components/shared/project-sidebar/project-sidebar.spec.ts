import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Project } from '../../../../../../Common/models/project.model';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ProjectSidebar } from './project-sidebar';

const projects: Project[] = [
  {
    id: 'project-1',
    title: 'Portfolio App',
    shortLabel: 'Portfolio',
    category: 'fullstack',
    description: 'Personal portfolio application.',
    imageUrl: '/img/project.png',
    technologies: ['Angular', 'Docker'],
    tags: ['design'],
    sourceUrl: '#',
    demoUrl: '#'
  }
];

describe('ProjectSidebar', () => {
  let component: ProjectSidebar;
  let fixture: ComponentFixture<ProjectSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectSidebar],
      providers: [...provideTestI18n()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectSidebar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('projects', projects);
    fixture.componentRef.setInput('selectedProjectId', 'project-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render project metadata without category controls', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('.project-sidebar__item-title')?.textContent).toContain(
      'Portfolio'
    );
    expect(host.querySelector('.project-sidebar__item-meta')?.textContent).toContain(
      'Angular'
    );
    const terms = Array.from(host.querySelectorAll('app-info-term')).map(
      (term) => term.textContent
    );

    expect(terms.some((term) => term?.includes('Docker'))).toBeTrue();
    expect(host.querySelector('.project-sidebar__categories')).toBeNull();
  });
});
