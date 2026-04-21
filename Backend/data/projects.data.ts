import { Project } from '../../Common/models/project.model';

const projectsData: Project[] = [
  {
    id: '1',
    title: 'Portfolio App',
    shortLabel: 'Portfolio',
    category: 'fullstack',
    description: 'Personal portfolio built with Angular and Node.',
    imageUrl: '/assets/images/projects/portfolio-app.png',
    technologies: ['Angular', 'Node.js', 'TypeScript'],
    sourceUrl: 'https://example.com/source',
    demoUrl: 'https://example.com/demo',
    isFeatured: true
  }
];

export { projectsData };