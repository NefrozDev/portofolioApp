import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { appConfig } from './app.config';

describe('appConfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: appConfig.providers
    });
  });

  it('should provide the Angular router', () => {
    expect(TestBed.inject(Router)).toBeTruthy();
  });

  it('should provide HttpClient', () => {
    expect(TestBed.inject(HttpClient)).toBeTruthy();
  });
});
