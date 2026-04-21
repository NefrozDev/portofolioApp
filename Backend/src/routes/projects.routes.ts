import { Router } from 'express';
import { Project } from '../../../Common/models/project.model';

const projectsRouter = Router();

const projectsData: Project[] = [
  {
    id: '1',
    title: 'Portfolio App',
    shortLabel: 'Portfolio',
    category: 'fullstack',
    description: 'Personal portfolio application built with Angular and Node.js.',
    imageUrl: '/assets/images/projects/portfolio-app.png',
    technologies: ['Angular', 'TypeScript', 'Node.js', 'Express'],
    sourceUrl: 'https://github.com/example/portfolio-app',
    demoUrl: 'https://example.com',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Task Dashboard',
    shortLabel: 'Dashboard',
    category: 'frontend',
    description: 'Interactive dashboard for managing and visualising tasks.',
    imageUrl: '/assets/images/projects/task-dashboard.png',
    technologies: ['Angular', 'SCSS', 'RxJS'],
    sourceUrl: 'https://github.com/example/task-dashboard',
    isFeatured: false,
  },
];

projectsRouter.get('/', (_req, res) => {
  res.status(200).json(projectsData);
});

export { projectsRouter };