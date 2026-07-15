import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ExperienceLoader } from './experience-loader';

describe('ExperienceLoader', () => {
  let fixture: ComponentFixture<ExperienceLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceLoader],
      providers: provideTestI18n()
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceLoader);
    fixture.detectChanges();
  });

  it('should expose loading status and two decorative skeleton cards', () => {
    const host = fixture.nativeElement as HTMLElement;
    const loader = host.querySelector<HTMLElement>('.experience-loader');

    expect(loader?.getAttribute('role')).toBe('status');
    expect(loader?.getAttribute('aria-busy')).toBe('true');
    expect(loader?.textContent).toContain('Loading experiences...');
    expect(host.querySelectorAll('.experience-loader__card').length).toBe(2);
  });
});
