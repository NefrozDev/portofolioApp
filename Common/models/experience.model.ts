export type PositionStatus =
  | 'employee'
  | 'freelance'
  | 'self-employed'
  | 'cadre'
  | 'corporate';

export interface Experience {
  id: string;
  company: string;
  role: string;
  status: PositionStatus;
  period: string;
  highlights: string[];
  technologies: string[];
  isExpanded: boolean;
  logoUrl?: string;
  recommendationLetterUrl?: string;
}
