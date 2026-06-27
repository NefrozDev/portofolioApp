import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Experience } from '@common/models/experience.model';
import { LanguageService } from '../language';

@Injectable({
  providedIn: 'root',
})
export class ExperiencesApi {
  private readonly baseUrl = `${environment.apiUrl}/experiences`;

  constructor(
    private readonly http: HttpClient,
    private readonly languageService: LanguageService
  ) {}

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.baseUrl, {
      params: { lang: this.languageService.getLanguage() }
    });
  }
}
