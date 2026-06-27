import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { appConfig } from './app.config';

describe('appConfig', () => {
  beforeEach(() => {
    localStorage.clear();

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

  it('should provide ngx-translate', () => {
    expect(TestBed.inject(TranslateService)).toBeTruthy();
  });

  it('should provide localized route titles', () => {
    expect(TestBed.inject(TitleStrategy)).toBeTruthy();
  });
});
