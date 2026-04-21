import { Router } from 'express';
import { Experience } from '../../../Common/models/experience.model';

const experiencesRouter = Router();

const experiencesData: Experience[] = [
  {
    id: '1',
    company: 'Example Company',
    role: 'Frontend Developer',
    period: '01-2024 - 12-2024',
    technologies: ['Angular', 'TypeScript', 'SCSS'],
    highlights: [
      'Built reusable UI components for internal products.',
      'Improved performance and maintainability of the frontend codebase.',
      'Collaborated with backend developers on API integration.',
    ],
    isExpanded: false,
  },
  {
    id: '2',
    company: 'Another Studio',
    role: 'Fullstack Developer',
    period: '01-2023 - 12-2023',
    technologies: ['Angular', 'Node.js', 'Express', 'PostgreSQL'],
    highlights: [
      'Developed frontend and backend features for client applications.',
      'Implemented REST APIs and integrated them with Angular services.',
      'Contributed to deployment and CI workflows.',
    ],
    isExpanded: false,
  },
];

experiencesRouter.get('/', (_req, res) => {
  res.status(200).json(experiencesData);
});

export { experiencesRouter };