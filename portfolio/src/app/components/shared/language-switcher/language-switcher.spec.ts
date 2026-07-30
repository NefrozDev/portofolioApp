import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { AppLanguage } from '@common/enums/app-language.enum';
import { LanguageService } from '../../../services/language';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  let component: LanguageSwitcher;
  let fixture: ComponentFixture<LanguageSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a language and navigate to its experiences page', () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate').and.resolveTo(true);

    component.selectLanguage(AppLanguage.FR);

    expect(TestBed.inject(LanguageService).currentLanguage()).toBe(AppLanguage.FR);
    expect(navigate).toHaveBeenCalledOnceWith(['/', AppLanguage.FR, 'experiences']);
    expect(component.isSelected(AppLanguage.FR)).toBeTrue();
  });

  it('should ignore an empty language code', () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate');
    spyOn(console, 'warn');

    component.selectLanguage('' as AppLanguage);

    expect(navigate).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });
});
