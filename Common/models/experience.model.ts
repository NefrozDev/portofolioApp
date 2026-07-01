export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
  technologies: string[];
  isExpanded: boolean;
  logoUrl?: string;
}