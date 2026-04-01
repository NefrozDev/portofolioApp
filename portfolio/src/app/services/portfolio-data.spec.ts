import { TestBed } from '@angular/core/testing';

import { PortfolioData } from './portfolio-data';

describe('PortfolioData', () => {
  let service: PortfolioData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
