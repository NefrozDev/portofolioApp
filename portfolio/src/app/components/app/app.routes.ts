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
        title: 'Home'
      },
      {
        path: 'experiences',
        loadComponent: () =>
          import('../../components/pages/experiences-page/experiences-page').then(
            (m) => m.ExperiencesPage
          ),
        title: 'Experiences'
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('../../components/pages/projects-page/projects-page').then(
            (m) => m.ProjectsPage
          ),
        title: 'Projects'
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('../../components/pages/contact-page/contact-page').then(
            (m) => m.ContactPage
          ),
        title: 'Contact'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'en'
  }
];