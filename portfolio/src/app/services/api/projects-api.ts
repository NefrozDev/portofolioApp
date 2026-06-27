import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Project } from '@common/models/project.model';
import { LanguageService } from '../language';

@Injectable({
  providedIn: 'root',
})
export class ProjectsApi {
  private readonly baseUrl = `${environment.apiUrl}/projects`;

  constructor(
    private readonly http: HttpClient,
    private readonly languageService: LanguageService
  ) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl, {
      params: { lang: this.languageService.getLanguage() }
    });
  }

  getFeaturedProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl, {
      params: { lang: this.languageService.getLanguage() }
    });
  }
}
