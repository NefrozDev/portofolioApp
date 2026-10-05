import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { languageGuard } from '../../guards/language.guard';
import { LanguageService } from '../../services/language';

// Saved language first, then the browser's language, then English.
export const redirectToPreferredLanguage = (): string =>
  inject(LanguageService).getLanguage();

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: redirectToPreferredLanguage
  },
  {
    path: ':lang',
    canActivate: [languageGuard],
    children: [
      {
        path: '',
        data: { showSiteHeader: false, description: 'app.seo.home' },
        loadComponent: () =>
          import('../../components/pages/home-page/home-page').then(
            (m) => m.HomePage
          ),
        title: 'app.navigation.home'
      },
      {
        path: 'experiences',
        data: { description: 'app.seo.experiences' },
        loadComponent: () =>
          import('../../components/pages/experiences-page/experiences-page').then(
            (m) => m.ExperiencesPage
          ),
        title: 'app.navigation.experiences'
      },
      {
        path: 'projects',
        data: { description: 'app.seo.projects' },
        loadComponent: () =>
          import('../../components/pages/projects-page/projects-page').then(
            (m) => m.ProjectsPage
          ),
        title: 'app.navigation.projects'
      },
      {
        path: 'contact',
        data: { description: 'app.seo.contact' },
        loadComponent: () =>
          import('../../components/pages/contact-page/contact-page').then(
            (m) => m.ContactPage
          ),
        title: 'app.navigation.contact'
      }
    ]
  },
  {
    path: '**',
    redirectTo: redirectToPreferredLanguage
  }
];
