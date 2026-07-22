import { AppLanguage } from '../enums/app-language.enum';

export type PortfolioTheme = 'dark' | 'light';

export interface PortfolioDemoContext {
  projectId: string;
  language: AppLanguage;
  theme: PortfolioTheme;
  returnUrl: string;
}
