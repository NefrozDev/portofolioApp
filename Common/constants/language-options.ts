import { AppLanguage } from '../enums/app-language.enum';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: AppLanguage.EN, label: 'English' },
  { code: AppLanguage.FR, label: 'Français' },
  { code: AppLanguage.NL, label: 'Nederlands' },
  { code: AppLanguage.ES, label: 'Español' },
  { code: AppLanguage.IT, label: 'Italiano' },
  { code: AppLanguage.DE, label: 'Deutsch' }
];