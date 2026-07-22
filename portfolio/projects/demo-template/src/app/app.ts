import { Component, inject } from '@angular/core';
import { DemoShell } from 'portfolio-ui';
import { PortfolioDemoContextService } from 'portfolio-sdk';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DemoShell],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly portfolioContext = inject(PortfolioDemoContextService);

  readonly context = this.portfolioContext.context;
  readonly exampleApiUrl = this.portfolioContext.buildApiUrl('projects');
}
