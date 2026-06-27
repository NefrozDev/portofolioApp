import { Routes } from '@angular/router';
import { languageGuard } from '../../guards/language.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'en'
  },
  {
    path: ':lang',
    canActivate: [languageGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../components/pages/home-page/home-page').then(
            (m) => m.HomePage
          ),
        title: 'app.navigation.home'
      },
      {
        path: 'experiences',
        loadComponent: () =>
          import('../../components/pages/experiences-page/experiences-page').then(
            (m) => m.ExperiencesPage
          ),
        title: 'app.navigation.experiences'
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('../../components/pages/projects-page/projects-page').then(
            (m) => m.ProjectsPage
          ),
        title: 'app.navigation.projects'
      },
      {
        path: 'contact',
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
    redirectTo: 'en'
  }
];
