import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Experience } from '../../../../../../Common/models/experience.model';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ExperienceCard } from './experience-card';

const experience: Experience = {
  id: 'exp-1',
  company: 'Company',
  role: 'Developer',
  period: '2024 - Present',
  technologies: ['Angular', 'Docker'],
  highlights: ['Built UI'],
  isExpanded: true
};

describe('ExperienceCard', () => {
  let component: ExperienceCard;
  let fixture: ComponentFixture<ExperienceCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceCard],
      providers: [...provideTestI18n()]
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

  it('should show information for the Docker technology tag', () => {
    const infoTerms = Array.from(
      fixture.nativeElement.querySelectorAll('app-info-term') as NodeListOf<HTMLElement>
    );
    const dockerTerm = infoTerms.find((term) =>
      term.textContent?.includes('Docker')
    );

    expect(dockerTerm?.textContent).toContain('packages an application');
  });

  it('should apply the expanded state class when open', () => {
    const card = fixture.nativeElement.querySelector('.experience-card') as HTMLElement;

    expect(card.classList.contains('experience-card--expanded')).toBeTrue();
  });

  it('should remove the expanded state class when closed', () => {
    fixture.componentRef.setInput('experience', { ...experience, isExpanded: false });
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.experience-card') as HTMLElement;

    expect(card.classList.contains('experience-card--expanded')).toBeFalse();
  });

  it('should keep the details region mounted so closing can animate', () => {
    fixture.componentRef.setInput('experience', { ...experience, isExpanded: false });
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.experience-card__content') as HTMLElement;

    expect(content).not.toBeNull();
    expect(content.getAttribute('aria-hidden')).toBe('true');
  });
});
