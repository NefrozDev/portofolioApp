import { AppLanguage } from '../enums/app-language.enum';

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
