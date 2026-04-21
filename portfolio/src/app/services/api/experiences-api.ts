import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Experience } from '@common/models/experience.model';

@Injectable({
  providedIn: 'root',
})
export class ExperiencesApi {
  private readonly baseUrl = `${environment.apiUrl}/experiences`;

  constructor(private readonly http: HttpClient) {}

  getExperiences(): Observable<Experience[]> {
    return this.http.get<Experience[]>(this.baseUrl);
  }
}