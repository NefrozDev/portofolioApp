import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './site-header/site-header';
import { MobileBottomNav } from './mobile-bottom-nav/mobile-bottom-nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeader, MobileBottomNav],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {}