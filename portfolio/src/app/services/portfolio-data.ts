import { Injectable } from '@angular/core';

import { getExperiencesForLanguage, getProjectsForLanguage } from '@common/i18n';
import { Experience } from '@common/models/experience.model';
import { Project } from '@common/models/project.model';
import { LanguageService } from './language';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  constructor(private readonly languageService: LanguageService) {}

  getExperiences(): Experience[] {
    return getExperiencesForLanguage(this.languageService.getLanguage());
  }

  getProjects(): Project[] {
    return getProjectsForLanguage(this.languageService.getLanguage());
  }
}
