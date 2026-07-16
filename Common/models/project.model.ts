export type ProjectCategory = 'frontend' | 'backend' | 'fullstack' | 'ui-ux';

export type ProjectTag =
  | 'documentation'
  | 'performance'
  | 'optimization'
  | 'design'
  | 'accessibility'
  | 'testing'
  | 'architecture';

export interface Project {
  id: string;
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
