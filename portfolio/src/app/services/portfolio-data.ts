import { Injectable } from '@angular/core';
import { Experience } from '../../../../Common/models/experience.model';
import { Project } from '../../../../Common/models/project.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {
  private readonly experiences: Experience[] = [
    {
      id: 'exp-1',
      company: 'Entreprise ABC',
      role: 'Senior Developer',
      period: 'Jan 2022 – Present',
      technologies: ['Angular', 'Docker', 'CSS', 'HTML'],
      highlights: [
        'Migration vers Angular 15',
        'Architecture microservices',
        'CI/CD avec GitHub Actions'
      ],
      isExpanded: true
    }
  ];

  private readonly projects: Project[] = [
    {
      id: 'project-1',
      title: 'Angular Dashboard',
      shortLabel: 'Angular Dashboard',
      category: 'fullstack',
      description:
        'Management web application built with Angular, Node.js and Docker, featuring an interactive dashboard, real-time statistics and a scalable architecture.',
      imageUrl: '/img/projects/angular-dashboard.png',
      technologies: ['Angular', 'Node.js', 'Docker'],
      sourceUrl: '#',
      demoUrl: '#',
      isFeatured: true
    },
    {
      id: 'project-2',
      title: 'DevOps Monitor',
      shortLabel: 'DevOps Monitor',
      category: 'backend',
      description:
        'Monitoring-oriented backend project for pipeline supervision, alerting and deployment visibility.',
      imageUrl: '/img/projects/devops-monitor.png',
      technologies: ['Node.js', 'Docker', 'API'],
      sourceUrl: '#',
      demoUrl: '#'
    },
    {
      id: 'project-3',
      title: 'Chat Application',
      shortLabel: 'Chat Application',
      category: 'frontend',
      description:
        'Modern messaging interface focused on responsiveness, usability and real-time interactions.',
      imageUrl: '/img/projects/chat-application.png',
      technologies: ['Angular', 'SCSS', 'WebSocket'],
      sourceUrl: '#',
      demoUrl: '#'
    },
    {
      id: 'project-4',
      title: 'Portfolio UI',
      shortLabel: 'Portfolio UI',
      category: 'ui-ux',
      description:
        'UI-focused portfolio project built from custom design explorations and responsive layouts.',
      imageUrl: '/img/projects/portfolio-ui.png',
      technologies: ['Figma', 'SCSS', 'Angular'],
      sourceUrl: '#',
      demoUrl: '#'
    }
  ];

  getExperiences(): Experience[] {
    return [...this.experiences];
  }

  getProjects(): Project[] {
    return [...this.projects];
  }
}