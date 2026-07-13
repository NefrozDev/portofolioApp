import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { AppLanguage } from '@common/enums/app-language.enum';
import { LanguageService } from '../language';
import { ContactApi } from './contact-api';

describe('ContactApi', () => {
  let service: ContactApi;
  let httpTesting: HttpTestingController;
  let languageService: LanguageService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ContactApi);
    httpTesting = TestBed.inject(HttpTestingController);
    languageService = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send contact messages for the current language', () => {
    languageService.setLanguage(AppLanguage.DE);

    service
      .sendMessage({
        name: 'Steven',
        email: 'steven@example.com',
        phone: '+32 470 12 34 56',
        message: 'Hello'
      })
      .subscribe((response) => {
        expect(response.message).toBe('ok');
      });

    const request = httpTesting.expectOne((req) => req.url.endsWith('/contact'));

    expect(request.request.params.get('lang')).toBe(AppLanguage.DE);

    request.flush({ message: 'ok' });
  });
});
