import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AppLanguage } from '@common/enums/app-language.enum';
import { LanguageService } from '../language';
import { ProjectsApi } from './projects-api';

describe('ProjectsApi', () => {
  let service: ProjectsApi;
  let httpTesting: HttpTestingController;
  let languageService: LanguageService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ProjectsApi);
    httpTesting = TestBed.inject(HttpTestingController);
    languageService = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request projects for the current language', () => {
    languageService.setLanguage(AppLanguage.FR);

    service.getProjects().subscribe((projects) => {
      expect(projects).toEqual([]);
    });

    const request = httpTesting.expectOne((req) => req.url.endsWith('/projects'));

    expect(request.request.params.get('lang')).toBe(AppLanguage.FR);

    request.flush([]);
  });
});
