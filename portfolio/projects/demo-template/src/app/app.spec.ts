import { TestBed } from '@angular/core/testing';
import { providePortfolioSdk } from 'portfolio-sdk';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        providePortfolioSdk({
          projectId: 'demo-template',
          portfolioUrl: 'https://portfolio.example/',
          apiBaseUrl: 'https://api.example/api'
        })
      ]
    }).compileComponents();
  });

  it('should render the shared demo shell and runtime context', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('pf-demo-shell')).toBeTruthy();
    expect(host.textContent).toContain('demo-template');
    expect(host.textContent).toContain('https://api.example/api/projects');
  });
});
