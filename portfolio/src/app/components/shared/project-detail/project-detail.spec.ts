import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Project } from '../../../../../../Common/models/project.model';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ProjectDetail } from './project-detail';

const project: Project = {
  id: 'project-1',
  title: 'Portfolio App',
  shortLabel: 'Portfolio',
  category: 'fullstack',
  description: 'Personal portfolio application.',
  imageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  technologies: ['Angular'],
  sourceUrl: '#',
  demoUrl: '#'
};

describe('ProjectDetail', () => {
  let component: ProjectDetail;
  let fixture: ComponentFixture<ProjectDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetail],
      providers: [...provideTestI18n()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetail);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', project);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
