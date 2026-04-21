import { Experience } from '../../Common/models/experience.model';

const experiencesData: Experience[] = [
  {
    id: '1',
    company: 'Example Company',
    role: 'Frontend Developer',
    period: '01-2024 - 12-2024',
    technologies: ['Angular', 'TypeScript', 'SCSS'],
    highlights: [
      'Built modern web interfaces.',
      'Integrated frontend views with backend APIs.',
      'Improved maintainability of the application structure.'
    ],
    isExpanded: false
  }
];

export { experiencesData };