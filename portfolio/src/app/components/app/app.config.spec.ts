import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { REMOVE_STYLES_ON_COMPONENT_DESTROY } from '@angular/platform-browser';
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

  it('should keep component styles for the copy of the page being swiped away', () => {
    expect(TestBed.inject(REMOVE_STYLES_ON_COMPONENT_DESTROY)).toBeFalse();
  });
});
