import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLanguage } from '@common/enums/app-language.enum';
import { LanguageService } from '../../../services/language';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  let component: LanguageSwitcher;
  let fixture: ComponentFixture<LanguageSwitcher>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LanguageSwitcher]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageSwitcher);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the chosen language and highlight it without switching yet', () => {
    const languageService = TestBed.inject(LanguageService);
    languageService.setLanguage(AppLanguage.EN);
    const selected: AppLanguage[] = [];
    component.languageSelected.subscribe((language) => selected.push(language));

    component.selectLanguage(AppLanguage.FR);

    expect(selected).toEqual([AppLanguage.FR]);
    expect(component.isSelected(AppLanguage.FR)).toBeTrue();
    expect(component.isSelected(AppLanguage.EN)).toBeFalse();
    expect(languageService.currentLanguage()).toBe(AppLanguage.EN);
  });

  it('should ignore an empty language code', () => {
    const selected: AppLanguage[] = [];
    component.languageSelected.subscribe((language) => selected.push(language));
    spyOn(console, 'warn');

    component.selectLanguage('' as AppLanguage);

    expect(selected).toEqual([]);
    expect(console.warn).toHaveBeenCalled();
  });
});
