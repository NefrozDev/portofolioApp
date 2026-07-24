import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Experience } from '@common/models/experience.model';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { RecommendationLetterDialog } from './recommendation-letter-dialog';

const experience: Experience = {
  id: 'icgreen-lead-dev',
  company: 'IC Green',
  role: 'Lead Developer',
  period: '2025 - Present',
  technologies: ['Angular'],
  highlights: [],
  isExpanded: true,
  recommendationLetterUrl: 'data:application/pdf;base64,JVBERi0xLjQ='
};

describe('RecommendationLetterDialog', () => {
  let fixture: ComponentFixture<RecommendationLetterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendationLetterDialog],
      providers: [...provideTestI18n()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendationLetterDialog);
    fixture.componentRef.setInput('experience', experience);
    fixture.detectChanges();
  });

  it('should render the company and configured PDF', () => {
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('h2')?.textContent?.trim()).toBe('IC Green');
    expect(host.querySelector('iframe')?.getAttribute('src')).toBe(
      experience.recommendationLetterUrl
    );
  });

  it('should open and close the native dialog', () => {
    const component = fixture.componentInstance;
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    const showModal = spyOn(dialog, 'showModal');
    const close = spyOn(dialog, 'close');

    component.open();
    component.close();

    expect(showModal).toHaveBeenCalled();
    expect(close).toHaveBeenCalled();
  });
});
