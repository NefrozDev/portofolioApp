export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  technologies: string[];
  highlights: string[];
  isExpanded?: boolean;
}