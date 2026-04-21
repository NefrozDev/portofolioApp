import { TestBed } from '@angular/core/testing';

import { ExperiencesApi } from './experiences-api';

describe('ExperiencesApi', () => {
  let service: ExperiencesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExperiencesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
