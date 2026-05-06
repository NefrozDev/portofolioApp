import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactApi } from './contact-api';

describe('ContactApi', () => {
  let service: ContactApi;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(ContactApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
