export type ProjectCategory =
  | 'frontend'
  | 'backend'
  | 'fullstack'
  | 'ui-ux'
  | 'mobile'
  | 'devops-cloud'
  | 'ai-data';

export type ProjectTag =
  | 'documentation'
  | 'performance'
  | 'optimization'
  | 'design'
  | 'accessibility'
  | 'testing'
  | 'architecture'
  | 'security'
  | 'responsive'
  | 'internationalization'
  | 'seo'
  | 'real-time'
  | 'observability'
  | 'scalability'
  | 'maintainability'
  | 'ci-cd'
  | 'data-visualization';

export interface Project {
  id: string;
  demoAppId?: string;
  title: string;
  shortLabel: string;
  category: ProjectCategory;
  description: string;
  imageUrl: string;
  technologies: string[];
  tags: ProjectTag[];
  sourceUrl?: string;
  demoUrl?: string;
  isFeatured?: boolean;
}
