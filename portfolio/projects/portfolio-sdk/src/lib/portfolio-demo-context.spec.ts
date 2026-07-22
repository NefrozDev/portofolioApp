import { AppLanguage } from '@portfolio/contracts';

import {
  PortfolioSdkConfig,
  resolvePortfolioDemoContext
} from './portfolio-demo-context';

describe('resolvePortfolioDemoContext', () => {
  const config: PortfolioSdkConfig = {
    projectId: 'robot-dashboard',
    portfolioUrl: 'https://portfolio.example/',
    apiBaseUrl: 'https://api.example/api'
  };

  it('should read supported context values from the demo URL', () => {
    const context = resolvePortfolioDemoContext(
      'https://demo.example/?lang=fr&theme=light&returnUrl=%2Ffr%2Fprojects',
      config
    );

    expect(context).toEqual({
      projectId: 'robot-dashboard',
      language: AppLanguage.FR,
      theme: 'light',
      returnUrl: 'https://portfolio.example/fr/projects'
    });
  });

  it('should reject an external return URL and unsupported values', () => {
    const context = resolvePortfolioDemoContext(
      'https://demo.example/?lang=xx&theme=neon&returnUrl=https://evil.example',
      config
    );

    expect(context).toEqual({
      projectId: 'robot-dashboard',
      language: AppLanguage.EN,
      theme: 'dark',
      returnUrl: 'https://portfolio.example/'
    });
  });
});
