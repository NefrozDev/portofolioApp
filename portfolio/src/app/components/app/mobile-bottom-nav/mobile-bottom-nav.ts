import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CV_DOWNLOAD_FILENAME,
  CV_WORD_DOWNLOAD_FILENAME
} from '../../../../../../Common/constants/cv';
import { NAVIGATION_ITEMS } from '../../../../../../Common/constants/navigation-items';
import { NavItem } from '../../../../../../Common/models/nav-item.model';
import { LanguageService } from '../../../services/language';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mobile-bottom-nav',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './mobile-bottom-nav.html',
  styleUrl: './mobile-bottom-nav.scss'
})
export class MobileBottomNav {
  private readonly languageService = inject(LanguageService);

  readonly navigationItems: NavItem[] = NAVIGATION_ITEMS;
  readonly cvDownloadFilename = CV_DOWNLOAD_FILENAME;
  readonly cvWordDownloadFilename = CV_WORD_DOWNLOAD_FILENAME;
  readonly isWordCvDownload = signal(false);
  readonly currentLanguage = computed(() => this.languageService.currentLanguage());

  getLink(route: string): string[] {
    return route
      ? ['/', this.currentLanguage(), route]
      : ['/', this.currentLanguage()];
  }

  getCvDownloadUrl(): string {
    const parameters = new URLSearchParams({ lang: this.currentLanguage() });

    if (this.isWordCvDownload()) {
      parameters.set('format', 'docx');
    }

    return `${environment.apiUrl}/cv?${parameters.toString()}`;
  }

  getCvDownloadFilename(): string {
    return this.isWordCvDownload()
      ? this.cvWordDownloadFilename
      : this.cvDownloadFilename;
  }

  @HostListener('document:keydown.w')
  enableWordCvDownload(): void {
    this.isWordCvDownload.set(true);
  }

  @HostListener('document:keyup.w')
  disableWordCvDownload(): void {
    this.isWordCvDownload.set(false);
  }

  @HostListener('window:blur')
  resetWordCvDownload(): void {
    this.isWordCvDownload.set(false);
  }
}
