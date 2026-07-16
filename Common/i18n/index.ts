import { AppLanguage } from '../enums/app-language.enum';
import { Experience } from '../models/experience.model';
import { Project } from '../models/project.model';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import it from './it.json';
import nl from './nl.json';

export type AppTranslations = typeof en;

export const APP_TRANSLATIONS: Record<AppLanguage, AppTranslations> = {
  [AppLanguage.EN]: en,
  [AppLanguage.FR]: fr,
  [AppLanguage.NL]: nl,
  [AppLanguage.ES]: es,
  [AppLanguage.IT]: it,
  [AppLanguage.DE]: de
};

const PROJECT_METADATA: Array<
  Pick<Project, 'id' | 'category' | 'imageUrl' | 'technologies' | 'tags' | 'sourceUrl' | 'demoUrl' | 'isFeatured'>
> = [
  {
    id: '1',
    category: 'fullstack',
    imageUrl: '/assets/images/projects/portfolio-app.png',
    technologies: ['Angular', 'TypeScript', 'Node.js', 'Express'],
    tags: ['documentation', 'performance', 'optimization', 'design', 'accessibility'],
    sourceUrl: 'https://github.com/example/portfolio-app',
    demoUrl: 'https://example.com',
    isFeatured: true
  },
  {
    id: '2',
    category: 'frontend',
    imageUrl: '/assets/images/projects/task-dashboard.png',
    technologies: ['Angular', 'SCSS', 'RxJS'],
    tags: ['performance', 'design', 'accessibility', 'testing'],
    sourceUrl: 'https://github.com/example/task-dashboard',
    isFeatured: false
  },
  {
    id: '3',
    category: 'backend',
    imageUrl: '/img/projects/devops-monitor.png',
    technologies: ['Node.js', 'Docker', 'API'],
    tags: ['documentation', 'performance', 'optimization', 'architecture'],
    sourceUrl: '#',
    demoUrl: '#'
  },
  {
    id: '4',
    category: 'frontend',
    imageUrl: '/img/projects/chat-application.png',
    technologies: ['Angular', 'SCSS', 'WebSocket'],
    tags: ['performance', 'optimization', 'design', 'accessibility'],
    sourceUrl: '#',
    demoUrl: '#'
  }
];

const EXPERIENCE_METADATA: Array<
  Pick<Experience, 'id' | 'role' | 'technologies' | 'isExpanded' | 'logoUrl'>
> = [
  {
    id: 'icgreen-lead-dev',
    role: 'Lead Developer',
    logoUrl: '/img/experiences/ic-green.png',
    technologies: ['Angular', 'TypeScript', 'Node.js', 'Docker', 'ROS / ROS2', 'MQTT', 'A.I.', 'Gerrit'],
    isExpanded: true
  },
  {
    id: 'tihange-software-engineer',
    role: 'Software Engineer',
    logoUrl: '/img/experiences/akkodis.svg',
    technologies: ['Angular', 'TypeScript', 'C#', '.NET', 'SQL', 'Azure DevOps'],
    isExpanded: false
  },
  {
    id: 'akkodis-internal-project',
    role: 'Software Engineering Consultant',
    logoUrl: '/img/experiences/akkodis.svg',
    technologies: ['Angular', 'TypeScript', 'FastAPI', 'Python', 'A.I.', 'Docker'],
    isExpanded: false
  },
  {
    id: 'pg-lfe-consultant',
    role: 'Software Engineering Consultant',
    logoUrl: '/img/experiences/procter-gamble.svg',
    technologies: ['Angular', 'TypeScript', 'C#', '.NET', 'REST API', 'SQL'],
    isExpanded: false
  },
  {
    id: 'pg-ana-sud-consultant',
    role: 'Software Engineering Consultant',
    logoUrl: '/img/experiences/procter-gamble.svg',
    technologies: ['C#', '.NET', 'SQL', 'Automation', 'Data Processing'],
    isExpanded: false
  },
  {
    id: 'avanade-academy',
    role: 'Software Engineering Consultant',
    logoUrl: '/img/experiences/avanade.svg',
    technologies: ['Microsoft Dynamics 365', 'Power Platform', 'Consulting'],
    isExpanded: false
  },
  {
    id: 'noomia-angular-ionic',
    role: 'Angular / Ionic Developer',
    logoUrl: '/img/experiences/noomia.png',
    technologies: ['Angular', 'Ionic', 'TypeScript', 'RxJS', 'NgRx', 'SCSS'],
    isExpanded: false
  },
  {
    id: 'inforius-fullstack',
    role: 'Full-Stack Angular / Node.js Developer',
    logoUrl: '/img/experiences/inforius.png',
    technologies: ['Angular', 'Node.js', 'Express', 'SQL', 'TypeScript'],
    isExpanded: false
  }
];

export function getAppTranslations(language: AppLanguage | string | null | undefined): AppTranslations {
  return APP_TRANSLATIONS[toSupportedLanguage(language)];
}

export function getProjectsForLanguage(language: AppLanguage | string | null | undefined): Project[] {
  const projects = getAppTranslations(language).data.projects;

  return PROJECT_METADATA.map((metadata) => {
    const project = projects[metadata.id as keyof typeof projects];

    return {
      ...metadata,
      title: project.title,
      shortLabel: project.shortLabel,
      description: project.description
    };
  });
}

export function getExperiencesForLanguage(
  language: AppLanguage | string | null | undefined
): Experience[] {
  const experiences = getAppTranslations(language).data.experiences;

  return EXPERIENCE_METADATA.map((metadata) => {
    const experience = experiences[metadata.id as keyof typeof experiences];

    return {
      ...metadata,
      company: experience.company,
      period: experience.period,
      highlights: [...experience.highlights]
    };
  });
}

export function toSupportedLanguage(language: AppLanguage | string | null | undefined): AppLanguage {
  return Object.values(AppLanguage).includes(language as AppLanguage)
    ? (language as AppLanguage)
    : AppLanguage.EN;
}
