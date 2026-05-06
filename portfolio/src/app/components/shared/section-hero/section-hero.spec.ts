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
});
