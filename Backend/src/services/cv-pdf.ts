import PDFDocument from 'pdfkit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { PORTFOLIO_PROFILE } from '../../../Common/constants/portfolio-profile';
import { Experience } from '../../../Common/models/experience.model';
import {
  getAppTranslations,
  getExperiencesForLanguage
} from '../../../Common/i18n';

const COLORS = {
  navy: '#0f172a',
  primary: '#4f46e5',
  primarySoft: '#eef2ff',
  heading: '#172033',
  body: '#334155',
  muted: '#64748b',
  rule: '#dbe3ef',
  white: '#ffffff'
} as const;

const PAGE = {
  left: 46,
  right: 46,
  bottom: 42,
  contentBottomOffset: 70
} as const;

const HERO_IMAGE_URL = 'https://www.synapseengineering.dev/img/userpic.png';
let heroImagePromise: Promise<Buffer | undefined> | undefined;

async function loadHeroImage(): Promise<Buffer | undefined> {
  const localCandidates = [
    path.resolve(process.cwd(), '../portfolio/public/img/userpic.png'),
    path.resolve(process.cwd(), 'portfolio/public/img/userpic.png')
  ];

  for (const candidate of localCandidates) {
    try {
      return await readFile(candidate);
    } catch {
      // The frontend asset may not be part of a standalone backend deployment.
    }
  }

  try {
    const response = await fetch(HERO_IMAGE_URL, {
      signal: AbortSignal.timeout(4_000)
    });

    if (response.ok) {
      return Buffer.from(await response.arrayBuffer());
    }
  } catch {
    // A CV can still be generated if the remote portrait is temporarily unavailable.
  }

  return undefined;
}

function getHeroImage(): Promise<Buffer | undefined> {
  heroImagePromise ??= loadHeroImage();
  return heroImagePromise;
}

function contentWidth(document: PDFKit.PDFDocument): number {
  return document.page.width - PAGE.left - PAGE.right;
}

function ensureSpace(document: PDFKit.PDFDocument, requiredHeight: number): void {
  const contentBottom = document.page.height - PAGE.contentBottomOffset;

  if (document.y + requiredHeight > contentBottom) {
    document.addPage();
  }
}

function addContinuationHeader(
  document: PDFKit.PDFDocument,
  name: string,
  position: string
): void {
  document.rect(0, 0, 7, document.page.height).fill(COLORS.primary);
  document
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.heading)
    .text(name, PAGE.left, 26, { lineBreak: false })
    .font('Helvetica')
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(position, PAGE.left, 28, {
      align: 'right',
      width: contentWidth(document),
      lineBreak: false
    });
  document
    .strokeColor(COLORS.rule)
    .lineWidth(0.7)
    .moveTo(PAGE.left, 47)
    .lineTo(document.page.width - PAGE.right, 47)
    .stroke();
  document.x = PAGE.left;
  document.y = 64;
}

function addHero(
  document: PDFKit.PDFDocument,
  name: string,
  position: string,
  tagline: string,
  linkedInLabel: string,
  heroImage: Buffer | undefined
): void {
  const heroHeight = 158;
  const portraitSize = 84;
  const portraitX = document.page.width - PAGE.right - portraitSize;
  const copyWidth = portraitX - PAGE.left - 22;

  document.rect(0, 0, document.page.width, heroHeight).fill(COLORS.navy);
  document.rect(0, 0, 9, heroHeight).fill(COLORS.primary);
  document
    .font('Helvetica-Bold')
    .fontSize(27)
    .fillColor(COLORS.white)
    .text(name, PAGE.left, 27, { width: copyWidth })
    .font('Helvetica')
    .fontSize(12.5)
    .fillColor('#a5b4fc')
    .text(position, PAGE.left, 64, { width: copyWidth })
    .font('Helvetica-Oblique')
    .fontSize(10.5)
    .fillColor('#e2e8f0')
    .text(tagline, PAGE.left, 88, { width: copyWidth, lineGap: 2 });

  document
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor('#cbd5e1')
    .text(PORTFOLIO_PROFILE.email, PAGE.left, 130, {
      link: `mailto:${PORTFOLIO_PROFILE.email}`,
      width: 145
    })
    .text(linkedInLabel, PAGE.left + 166, 130, {
      link: PORTFOLIO_PROFILE.linkedInUrl,
      width: 80
    });

  if (heroImage) {
    const portraitY = 29;

    document.save();
    document
      .circle(
        portraitX + portraitSize / 2,
        portraitY + portraitSize / 2,
        portraitSize / 2
      )
      .clip();
    document.image(heroImage, portraitX, portraitY, {
      cover: [portraitSize, portraitSize],
      align: 'center'
    });
    document.restore();
    document
      .circle(
        portraitX + portraitSize / 2,
        portraitY + portraitSize / 2,
        portraitSize / 2
      )
      .lineWidth(2)
      .strokeColor('#818cf8')
      .stroke();
  }

  document.x = PAGE.left;
  document.y = 177;
}

function addSectionHeading(document: PDFKit.PDFDocument, title: string): void {
  ensureSpace(document, 42);
  const headingY = document.y + 7;

  document.roundedRect(PAGE.left, headingY, 4, 14, 2).fill(COLORS.primary);
  document
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .fillColor(COLORS.heading)
    .text(title.toUpperCase(), PAGE.left + 13, headingY + 1, { lineBreak: false });
  document
    .strokeColor(COLORS.rule)
    .lineWidth(0.7)
    .moveTo(PAGE.left + 13, headingY + 21)
    .lineTo(document.page.width - PAGE.right, headingY + 21)
    .stroke();

  document.x = PAGE.left;
  document.y = headingY + 31;
}

function addSkillTags(document: PDFKit.PDFDocument, skills: string[]): void {
  const maxX = document.page.width - PAGE.right;
  const chipHeight = 18;
  let x = PAGE.left;
  let y = document.y;

  document.font('Helvetica-Bold').fontSize(7.5);

  for (const skill of skills) {
    const chipWidth = document.widthOfString(skill) + 14;

    if (x + chipWidth > maxX) {
      x = PAGE.left;
      y += chipHeight + 5;
    }

    document.roundedRect(x, y, chipWidth, chipHeight, 5).fill(COLORS.primarySoft);
    document
      .fillColor(COLORS.primary)
      .text(skill, x + 7, y + 5, { lineBreak: false });
    x += chipWidth + 6;
  }

  document.x = PAGE.left;
  document.y = y + chipHeight + 2;
}

function experienceHeight(
  document: PDFKit.PDFDocument,
  experience: Experience,
  width: number
): number {
  document.font('Helvetica').fontSize(8.7);
  const highlightsHeight = experience.highlights.reduce(
    (height, highlight) => height + document.heightOfString(highlight, { width: width - 17 }) + 5,
    0
  );

  return 56 + highlightsHeight;
}

function addExperience(document: PDFKit.PDFDocument, experience: Experience): void {
  const dateWidth = 92;
  const columnGap = 20;
  const detailsX = PAGE.left + dateWidth + columnGap;
  const detailsWidth = document.page.width - PAGE.right - detailsX;
  const estimatedHeight = experienceHeight(document, experience, detailsWidth);

  ensureSpace(document, Math.min(estimatedHeight, 210));
  const startY = document.y;

  document
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(COLORS.primary)
    .text(experience.period, PAGE.left, startY + 2, {
      width: dateWidth,
      align: 'right'
    });

  document.circle(PAGE.left + dateWidth + 10, startY + 6, 3).fill(COLORS.primary);
  document
    .strokeColor(COLORS.rule)
    .lineWidth(1)
    .moveTo(PAGE.left + dateWidth + 10, startY + 12)
    .lineTo(PAGE.left + dateWidth + 10, startY + Math.max(estimatedHeight - 8, 38))
    .stroke();

  document
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(COLORS.heading)
    .text(experience.role, detailsX, startY, { width: detailsWidth })
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(COLORS.primary)
    .text(experience.company, detailsX, document.y + 1, { width: detailsWidth });

  let textY = document.y + 7;
  for (const highlight of experience.highlights) {
    const bulletHeight = document
      .font('Helvetica')
      .fontSize(8.7)
      .heightOfString(highlight, { width: detailsWidth - 17, lineGap: 1 });

    if (textY + bulletHeight + 25 > document.page.height - PAGE.contentBottomOffset) {
      document.addPage();
      textY = document.y;
    }

    document.circle(detailsX + 3, textY + 4, 1.5).fill(COLORS.primary);
    document
      .font('Helvetica')
      .fontSize(8.7)
      .fillColor(COLORS.body)
      .text(highlight, detailsX + 13, textY, {
        width: detailsWidth - 13,
        lineGap: 1
      });
    textY = document.y + 4;
  }

  document
    .font('Helvetica-Oblique')
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text(experience.technologies.join('  •  '), detailsX + 13, textY + 1, {
      width: detailsWidth - 13,
      lineGap: 1
    });
  document.x = PAGE.left;
  document.y += 15;
}

function addPageNumbers(document: PDFKit.PDFDocument): void {
  const pageRange = document.bufferedPageRange();

  for (let pageIndex = 0; pageIndex < pageRange.count; pageIndex += 1) {
    document.switchToPage(pageIndex);
    const footerY = document.page.height - PAGE.bottom - 13;

    document
      .font('Helvetica')
      .fontSize(7.5)
      .fillColor(COLORS.muted)
      .text(`${pageIndex + 1} / ${pageRange.count}`, PAGE.left, footerY, {
        width: contentWidth(document),
        align: 'right',
        lineBreak: false
      });
  }
}

export async function createCvPdf(language?: string): Promise<Buffer> {
  const translations = getAppTranslations(language);
  const experiences = getExperiencesForLanguage(language);
  const heroImage = await getHeroImage();
  const skills = Array.from(
    new Set(experiences.flatMap((experience) => experience.technologies))
  );

  const document = new PDFDocument({
    size: 'A4',
    margins: { top: 42, right: PAGE.right, bottom: PAGE.bottom, left: PAGE.left },
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

  document.on('pageAdded', () => {
    addContinuationHeader(document, translations.home.name, translations.home.position);
  });

  addHero(
    document,
    translations.home.name,
    translations.home.position,
    translations.home.description,
    translations.contact.links.linkedin,
    heroImage
  );

  addSectionHeading(document, translations.cv.skills);
  addSkillTags(document, skills);

  ensureSpace(document, 170);
  addSectionHeading(document, translations.cv.experience);
  for (const experience of experiences) {
    addExperience(document, experience);
  }

  addPageNumbers(document);
  document.end();
  return completed;
}

export type CvPdfGenerator = typeof createCvPdf;
