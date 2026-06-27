import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AppLanguage } from '@common/enums/app-language.enum';
import { LanguageService } from '../language';
import { ExperiencesApi } from './experiences-api';

describe('ExperiencesApi', () => {
  let service: ExperiencesApi;
  let httpTesting: HttpTestingController;
  let languageService: LanguageService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ExperiencesApi);
    httpTesting = TestBed.inject(HttpTestingController);
    languageService = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request experiences for the current language', () => {
    languageService.setLanguage(AppLanguage.NL);

    service.getExperiences().subscribe((experiences) => {
      expect(experiences).toEqual([]);
    });

    const request = httpTesting.expectOne((req) => req.url.endsWith('/experiences'));

    expect(request.request.params.get('lang')).toBe(AppLanguage.NL);

    request.flush([]);
  });
});
