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
  tags: ['documentation', 'design'],
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

  it('should display technologies separately from semantic project tags', () => {
    const host = fixture.nativeElement as HTMLElement;
    const groups = host.querySelectorAll('.project-detail__tag-group');

    expect(groups.length).toBe(2);
    expect(groups[0].textContent).toContain('Angular');
    expect(groups[1].textContent).toContain('Documentation');
    expect(groups[1].textContent).toContain('Design');
  });

  it('should show a branded fallback when the preview image fails', () => {
    component.onImageError();
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const placeholder = host.querySelector('.project-detail__image-placeholder');

    expect(
      placeholder?.classList.contains(
        'project-detail__image-placeholder--visible'
      )
    ).toBeTrue();
    expect(placeholder?.textContent).toContain('Portfolio');
  });
});
