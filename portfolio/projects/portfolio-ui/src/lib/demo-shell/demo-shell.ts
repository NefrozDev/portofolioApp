import { Component, input } from '@angular/core';

@Component({
  selector: 'pf-demo-shell',
  standalone: true,
  templateUrl: './demo-shell.html',
  styleUrl: './demo-shell.scss'
})
export class DemoShell {
  readonly title = input.required<string>();
  readonly subtitle = input('Portfolio project');
  readonly returnUrl = input.required<string>();
  readonly backLabel = input('Back to portfolio');
}
