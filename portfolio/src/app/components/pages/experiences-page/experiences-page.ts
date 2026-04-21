import { Component, OnInit, signal } from '@angular/core';
import { MobileBottomNav } from '../../app/mobile-bottom-nav/mobile-bottom-nav';
import { SectionHero } from '../../shared/section-hero/section-hero';
import { ExperienceCard } from '../../shared/experience-card/experience-card';
import { Experience } from '@common/models/experience.model';
import { ExperiencesApi } from '../../../services/api/experiences-api';

@Component({
  selector: 'app-experiences-page',
  standalone: true,
  imports: [MobileBottomNav, SectionHero, ExperienceCard],
  templateUrl: './experiences-page.html',
  styleUrls: ['./experiences-page.scss']
})
export class ExperiencesPage implements OnInit {
  readonly experiences = signal<Experience[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly loadError = signal<string | null>(null);

  constructor(private readonly experiencesApi: ExperiencesApi) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  private loadExperiences(): void {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.experiencesApi.getExperiences().subscribe({
      next: (experiences) => {
        this.experiences.set(experiences);
        this.isLoading.set(false);

        if (!experiences.length) {
          console.warn('ExperiencesPage: aucune expérience disponible au chargement.');
        }
      },
      error: (error: unknown) => {
        console.error('ExperiencesPage: échec du chargement des expériences.', error);
        this.experiences.set([]);
        this.loadError.set('Unable to load experiences.');
        this.isLoading.set(false);
      }
    });
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