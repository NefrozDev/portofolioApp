import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { HomePage } from './home-page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [...provideTestI18n()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should animate the portrait, presentation and language controls into view', () => {
    const host = fixture.nativeElement as HTMLElement;
    const portrait = host.querySelector<HTMLElement>('.home__image');
    const headline = host.querySelector<HTMLElement>('.home__headline');
    const description = host.querySelector<HTMLElement>(
      '.home__description-row'
    );
    const languages = host.querySelector<HTMLElement>('.home__languages');

    expect(getComputedStyle(portrait!).animationName).toContain(
      'home-image-enter'
    );
    expect(getComputedStyle(headline!).animationName).toContain(
      'home-content-enter'
    );
    expect(getComputedStyle(description!).animationName).toContain(
      'home-content-enter'
    );
    expect(getComputedStyle(languages!).animationName).toContain(
      'home-languages-enter'
    );
  });
});
