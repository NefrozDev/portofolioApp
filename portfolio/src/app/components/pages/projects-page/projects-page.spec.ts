import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    sourceUrl: '#',
    demoUrl: '#'
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
});
