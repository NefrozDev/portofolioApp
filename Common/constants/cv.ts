import { AppLanguage } from '../enums/app-language.enum';
import { TechnologyTag } from '../models/experience.model';

// General CV skills that are not assigned to a specific position.
export const CV_ADDITIONAL_SKILLS: TechnologyTag[] = [
  { name: 'GitHub' },
  { name: 'GitLab' },
  { name: 'GitKraken' },
  { name: 'Bitbucket' },
  { name: 'OWASP' }
];

export function getCvDownloadFilename(
  language: AppLanguage,
  format: 'pdf' | 'docx' = 'pdf',
  date: Date = new Date()
): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `CV-Steven-De-Moor-${day}-${month}-${year}-${language.toUpperCase()}.${format}`;
}
