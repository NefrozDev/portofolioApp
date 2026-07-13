import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './site-header/site-header';
import { MobileBottomNav } from './mobile-bottom-nav/mobile-bottom-nav';
import { AppStateService } from '../../services/app-state';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeader, MobileBottomNav],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  readonly appState = inject(AppStateService);
}
