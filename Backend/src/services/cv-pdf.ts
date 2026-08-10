import PDFDocument from 'pdfkit';

import { PORTFOLIO_PROFILE } from '../../../Common/constants/portfolio-profile';
import {
  getAppTranslations,
  getExperiencesForLanguage,
  getProjectsForLanguage
} from '../../../Common/i18n';

const COLORS = {
  primary: '#4f46e5',
  heading: '#172033',
  body: '#334155',
  muted: '#64748b',
  rule: '#cbd5e1'
} as const;

function addSectionHeading(document: PDFKit.PDFDocument, title: string): void {
  document
    .moveDown(0.8)
    .font('Helvetica-Bold')
    .fontSize(13)
    .fillColor(COLORS.primary)
    .text(title.toUpperCase())
    .moveDown(0.25);

  const ruleY = document.y;
  document
    .strokeColor(COLORS.rule)
    .lineWidth(0.6)
    .moveTo(document.page.margins.left, ruleY)
    .lineTo(document.page.width - document.page.margins.right, ruleY)
    .stroke()
    .moveDown(0.5);
}

function addBullet(document: PDFKit.PDFDocument, text: string): void {
  document
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.body)
    .text(`•  ${text}`, { indent: 10, paragraphGap: 2 });
}

export async function createCvPdf(language?: string): Promise<Buffer> {
  const translations = getAppTranslations(language);
  const experiences = getExperiencesForLanguage(language);
  const projects = getProjectsForLanguage(language).filter(
    (project) => project.isFeatured || project.demoUrl !== '#'
  );
  const skills = Array.from(
    new Set([
      ...experiences.flatMap((experience) => experience.technologies),
      ...projects.flatMap((project) => project.technologies)
    ])
  );

  const document = new PDFDocument({
    size: 'A4',
    margin: 42,
    bufferPages: true,
    info: {
      Title: `${translations.home.name} - ${translations.cv.title}`,
      Author: translations.home.name,
      Subject: translations.home.position
    }
  });
  const chunks: Buffer[] = [];
  const completed = new Promise<Buffer>((resolve, reject) => {
    document.on('data', (chunk: Buffer) => chunks.push(chunk));
    document.on('end', () => resolve(Buffer.concat(chunks)));
    document.on('error', reject);
  });

  document
    .font('Helvetica-Bold')
    .fontSize(25)
    .fillColor(COLORS.heading)
    .text(translations.home.name)
    .font('Helvetica')
    .fontSize(13)
    .fillColor(COLORS.primary)
    .text(translations.home.position)
    .moveDown(0.45)
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(PORTFOLIO_PROFILE.email, { link: `mailto:${PORTFOLIO_PROFILE.email}` })
    .text(PORTFOLIO_PROFILE.linkedInUrl, { link: PORTFOLIO_PROFILE.linkedInUrl });

  addSectionHeading(document, translations.cv.profile);
  document
    .font('Helvetica')
    .fontSize(10)
    .fillColor(COLORS.body)
    .text(translations.home.description, { lineGap: 2 });

  addSectionHeading(document, translations.cv.skills);
  document
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.body)
    .text(skills.join('  |  '), { lineGap: 3 });

  addSectionHeading(document, translations.cv.experience);
  for (const experience of experiences) {
    document
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor(COLORS.heading)
      .text(`${experience.role} - ${experience.company}`, { continued: true })
      .font('Helvetica')
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(`  ${experience.period}`, { align: 'right' })
      .moveDown(0.15);

    for (const highlight of experience.highlights) {
      addBullet(document, highlight);
    }

    document
      .font('Helvetica-Oblique')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(experience.technologies.join('  |  '), { indent: 10 })
      .moveDown(0.55);
  }

  addSectionHeading(document, translations.cv.projects);
  for (const project of projects) {
    document
      .font('Helvetica-Bold')
      .fontSize(10)
      .fillColor(COLORS.heading)
      .text(project.title)
      .font('Helvetica')
      .fontSize(9)
      .fillColor(COLORS.body)
      .text(project.description, { lineGap: 2 })
      .font('Helvetica-Oblique')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(project.technologies.join('  |  '))
      .moveDown(0.55);
  }

  const pageRange = document.bufferedPageRange();
  for (let pageIndex = 0; pageIndex < pageRange.count; pageIndex += 1) {
    document.switchToPage(pageIndex);
    document
      .font('Helvetica')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(
        `${pageIndex + 1} / ${pageRange.count}`,
        document.page.margins.left,
        document.page.height - 28,
        {
          width: document.page.width - document.page.margins.left - document.page.margins.right,
          align: 'right',
          lineBreak: false
        }
      );
  }

  document.end();
  return completed;
}

export type CvPdfGenerator = typeof createCvPdf;
