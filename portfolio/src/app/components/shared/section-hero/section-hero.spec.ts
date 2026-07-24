import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHero } from './section-hero';

describe('SectionHero', () => {
  let component: SectionHero;
  let fixture: ComponentFixture<SectionHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionHero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionHero);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Portfolio');
    fixture.componentRef.setInput('subtitle', 'Recent work');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render an accessible warning beside the title when provided', () => {
    fixture.componentRef.setInput('warningLabel', 'Page under construction');
    fixture.detectChanges();

    const marker = fixture.nativeElement.querySelector(
      '.hero-block__construction-warning'
    ) as HTMLElement | null;
    const title = fixture.nativeElement.querySelector('.page-title');

    expect(marker).toBeTruthy();
    expect(marker?.nextElementSibling).toBe(title);
    expect(marker?.getAttribute('role')).toBe('status');
    expect(marker?.textContent?.trim()).toBe('Page under construction');
    expect(marker?.getAttribute('title')).toBe('Page under construction');
  });
});
