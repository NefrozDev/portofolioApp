import { Component, output, signal } from '@angular/core';
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
  readonly languageSelected = output<AppLanguage>();

  // Highlights the clicked language while the page plays its exit animation.
  private readonly chosenLanguage = signal<AppLanguage | null>(null);

  constructor(private readonly languageService: LanguageService) {}

  selectLanguage(languageCode: AppLanguage): void {
    if (!languageCode) {
      console.warn('LanguageSwitcher: empty languageCode ignored.');
      return;
    }

    this.chosenLanguage.set(languageCode);
    this.languageSelected.emit(languageCode);
  }

  isSelected(languageCode: AppLanguage): boolean {
    return (this.chosenLanguage() ?? this.languageService.currentLanguage()) === languageCode;
  }
}
