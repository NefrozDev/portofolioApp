export type ProjectCategory = 'frontend' | 'backend' | 'fullstack' | 'ui-ux';

export interface Project {
  id: string;
  title: string;
  shortLabel: string;
  category: ProjectCategory;
  description: string;
  imageUrl: string;
  technologies: string[];
  sourceUrl?: string;
  demoUrl?: string;
  isFeatured?: boolean;
}