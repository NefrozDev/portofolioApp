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
    technologies: ['Angular'],
    highlights: ['Built UI'],
    isExpanded: true
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
});
