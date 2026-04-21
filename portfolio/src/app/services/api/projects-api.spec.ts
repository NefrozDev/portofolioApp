import { TestBed } from '@angular/core/testing';

import { ProjectsApi } from './projects-api';

describe('ProjectsApi', () => {
  let service: ProjectsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
