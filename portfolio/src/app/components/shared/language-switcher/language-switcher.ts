import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppLanguage } from '../../../../../../Common/enums/app-language.enum';
import { LANGUAGE_OPTIONS } from '../../../../../../Common/constants/language-options';
import { LanguageOption } from '../../../../../../Common/models/language.model';
import { LanguageService } from '../../../services/language';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  templateUrl: './language-switcher.html',
  styleUrls: ['./language-switcher.scss']
})
export class LanguageSwitcher {
  readonly languages: LanguageOption[] = LANGUAGE_OPTIONS;

  constructor(
    private readonly languageService: LanguageService,
    private readonly router: Router
  ) {}

  selectLanguage(languageCode: AppLanguage): void {
    if (!languageCode) {
      console.warn('LanguageSwitcher: languageCode vide ignoré.');
      return;
    }

    this.languageService.setLanguage(languageCode);
    void this.router.navigate(['/', languageCode, 'experiences']);
  }

  isSelected(languageCode: AppLanguage): boolean {
    return this.languageService.currentLanguage() === languageCode;
  }
}