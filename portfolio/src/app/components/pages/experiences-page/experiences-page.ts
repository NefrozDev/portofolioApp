import { Component, signal } from '@angular/core';
import { SiteHeader } from '../../app/site-header/site-header';
import { MobileBottomNav } from '../../app/mobile-bottom-nav/mobile-bottom-nav';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ExperienceCard } from '../../shared/experience-card/experience-card';
import { Experience } from '../../../../../../Common/models/experience.model';
import { PortfolioDataService } from '../../../services/portfolio-data';

@Component({
  selector: 'app-experiences-page',
  standalone: true,
  imports: [ MobileBottomNav, SectionHero, ExperienceCard],
  templateUrl: './experiences-page.html',
  styleUrls: ['./experiences-page.scss']
})
export class ExperiencesPage {
  readonly experiences = signal<Experience[]>([]);

  constructor(private readonly portfolioDataService: PortfolioDataService) {
    this.experiences.set(this.portfolioDataService.getExperiences());
  }

  toggleExperience(experienceId: string): void {
    if (!experienceId) {
      console.warn('ExperiencesPage: experienceId vide ignoré.');
      return;
    }

    this.experiences.update((items) =>
      items.map((item) =>
        item.id === experienceId
          ? { ...item, isExpanded: !item.isExpanded }
          : item
      )
    );
  }
}