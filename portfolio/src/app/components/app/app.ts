import { Component, ElementRef, afterNextRender, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeader } from './site-header/site-header';
import { MobileBottomNav } from './mobile-bottom-nav/mobile-bottom-nav';
import { AppStateService } from '../../services/app-state';
import { PageSwipeService } from '../../services/page-swipe';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeader, MobileBottomNav],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  readonly appState = inject(AppStateService);

  private readonly viewport = viewChild.required<ElementRef<HTMLElement>>('viewport');
  private readonly page = viewChild.required<ElementRef<HTMLElement>>('page');

  constructor() {
    const pageSwipe = inject(PageSwipeService);

    afterNextRender(() => {
      pageSwipe.attach(this.viewport().nativeElement, this.page().nativeElement);
    });
  }
}
