import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Experience } from '../../../../../../Common/models/experience.model';
import { ExperienceCard } from './experience-card';

const experience: Experience = {
  id: 'exp-1',
  company: 'Company',
  role: 'Developer',
  period: '2024 - Present',
  technologies: ['Angular'],
  highlights: ['Built UI'],
  isExpanded: true
};

describe('ExperienceCard', () => {
  let component: ExperienceCard;
  let fixture: ComponentFixture<ExperienceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('experience', experience);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
