import PDFDocument from 'pdfkit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { PORTFOLIO_PROFILE } from '../../../Common/constants/portfolio-profile';
import {
  Experience,
  TechnologyTag,
  formatTechnologyTag
} from '../../../Common/models/experience.model';
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

const versionCollator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base'
});

export function getLatestTechnologyTags(
  experiences: Experience[]
): TechnologyTag[] {
  const latestByName = new Map<string, TechnologyTag>();

  for (const technology of experiences.flatMap((experience) => experience.technologies)) {
    const current = latestByName.get(technology.name);

    if (
      !current ||
      (technology.version &&
        (!current.version || versionCollator.compare(technology.version, current.version) > 0))
    ) {
      latestByName.set(technology.name, technology);
    }
  }

  return [...latestByName.values()];
}

function technologyLabels(experience: Experience): string[] {
  return experience.technologies.map(formatTechnologyTag);
}

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
    .fontSize(11.5)
    .fillColor(COLORS.heading)
    .text(name, PAGE.left, 26, { lineBreak: false })
    .font('Helvetica')
    .fontSize(8.5)
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

function addEmailIcon(document: PDFKit.PDFDocument, x: number, y: number): void {
  const envelopeY = y + 1.5;

  document.save();
  document
    .roundedRect(x, envelopeY, 14, 11, 2)
    .lineWidth(1.2)
    .strokeColor('#a5b4fc')
    .stroke();
  document
    .moveTo(x + 1.5, envelopeY + 2)
    .lineTo(x + 7, envelopeY + 6.5)
    .lineTo(x + 12.5, envelopeY + 2)
    .stroke();
  document.restore();
}

function addLinkedInIcon(document: PDFKit.PDFDocument, x: number, y: number): void {
  document.save();
  document.roundedRect(x, y, 14, 14, 2.5).fill('#818cf8');
  document
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor(COLORS.navy)
    .text('in', x + 3, y + 3.5, { lineBreak: false });
  document.restore();
}

function addHero(
  document: PDFKit.PDFDocument,
  name: string,
  position: string,
  tagline: string,
  contactInvitation: string,
  linkedInLabel: string,
  heroImage: Buffer | undefined
): void {
  const heroHeight = 200;
  const portraitSize = 142;
  const portraitX = PAGE.left;
  const copyX = portraitX + portraitSize + 24;
  const copyWidth = document.page.width - PAGE.right - copyX;

  document.rect(0, 0, document.page.width, heroHeight).fill(COLORS.navy);
  document.rect(0, 0, 9, heroHeight).fill(COLORS.primary);
  document
    .font('Helvetica-Bold')
    .fontSize(27)
    .fillColor(COLORS.white)
    .text(name, copyX, 25, { width: copyWidth })
    .font('Helvetica')
    .fontSize(13)
    .fillColor('#a5b4fc')
    .text(position, copyX, 62, { width: copyWidth })
    .font('Helvetica-Oblique')
    .fontSize(10.8)
    .fillColor('#e2e8f0')
    .text(tagline, copyX, 88, { width: copyWidth, lineGap: 2.5 })
    .font('Helvetica')
    .fontSize(9.8)
    .fillColor('#cbd5e1')
    .text(contactInvitation, copyX, 111, { width: copyWidth, lineGap: 2.5 });

  const contactY = 156;
  const contactLabelY = contactY + 3.2;
  addEmailIcon(document, copyX, contactY);
  addLinkedInIcon(document, copyX + 183, contactY);
  document
    .font('Helvetica-Bold')
    .fontSize(10.3)
    .fillColor('#cbd5e1')
    .text(PORTFOLIO_PROFILE.email, copyX + 21, contactLabelY, {
      link: `mailto:${PORTFOLIO_PROFILE.email}`,
      width: 155
    })
    .text(linkedInLabel, copyX + 204, contactLabelY, {
      link: PORTFOLIO_PROFILE.linkedInUrl,
      width: 80
    });

  if (heroImage) {
    const portraitY = 25;

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
  document.y = 219;
}

function addSectionHeading(document: PDFKit.PDFDocument, title: string): void {
  ensureSpace(document, 42);
  const headingY = document.y + 7;

  document.roundedRect(PAGE.left, headingY, 4, 14, 2).fill(COLORS.primary);
  document
    .font('Helvetica-Bold')
    .fontSize(11)
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
  const chipHeight = 19;
  let x = PAGE.left;
  let y = document.y;

  document.font('Helvetica-Bold').fontSize(8);

  for (const skill of skills) {
    const chipWidth = document.widthOfString(skill) + 14;

    if (x + chipWidth > maxX) {
      x = PAGE.left;
      y += chipHeight + 6;
    }

    document.roundedRect(x, y, chipWidth, chipHeight, 5).fill(COLORS.primarySoft);
    document
      .fillColor(COLORS.primary)
      .text(skill, x + 7, y + 5.5, { lineBreak: false });
    x += chipWidth + 6;
  }

  document.x = PAGE.left;
  document.y = y + chipHeight + 14;
}

function experienceHeight(
  document: PDFKit.PDFDocument,
  experience: Experience,
  width: number
): number {
  document.font('Helvetica').fontSize(9);
  const highlightsHeight = experience.highlights.reduce(
    (height, highlight) =>
      height + document.heightOfString(highlight, { width: width - 17, lineGap: 1.5 }) + 6,
    0
  );
  document.font('Helvetica-Oblique').fontSize(8);
  const technologiesHeight = document.heightOfString(
    technologyLabels(experience).join('  •  '),
    { width, lineGap: 1.5 }
  );

  return 62 + technologiesHeight + highlightsHeight;
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
    .fontSize(8.5)
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
    .fontSize(11.5)
    .fillColor(COLORS.heading)
    .text(experience.role, detailsX, startY, { width: detailsWidth })
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .fillColor(COLORS.primary)
    .text(experience.company, detailsX, document.y + 4, { width: detailsWidth });

  document
    .font('Helvetica-Oblique')
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(technologyLabels(experience).join('  •  '), detailsX, document.y + 5, {
      width: detailsWidth,
      lineGap: 1.5
    });

  let textY = document.y + 9;
  for (const highlight of experience.highlights) {
    const bulletHeight = document
      .font('Helvetica')
      .fontSize(9)
      .heightOfString(highlight, { width: detailsWidth - 17, lineGap: 1.5 });

    if (textY + bulletHeight + 25 > document.page.height - PAGE.contentBottomOffset) {
      document.addPage();
      textY = document.y;
    }

    document.circle(detailsX + 3, textY + 4, 1.5).fill(COLORS.primary);
    document
      .font('Helvetica')
      .fontSize(9)
      .fillColor(COLORS.body)
      .text(highlight, detailsX + 13, textY, {
        width: detailsWidth - 13,
        lineGap: 1.5
      });
    textY = document.y + 5;
  }

  document.x = PAGE.left;
  document.y = textY + 14;
}

function addPageNumbers(document: PDFKit.PDFDocument): void {
  const pageRange = document.bufferedPageRange();

  for (let pageIndex = 0; pageIndex < pageRange.count; pageIndex += 1) {
    document.switchToPage(pageIndex);
    const footerY = document.page.height - PAGE.bottom - 13;

    document
      .font('Helvetica')
      .fontSize(8)
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
  const skills = getLatestTechnologyTags(experiences).map(formatTechnologyTag);

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
    `${translations.contact.subtitle} ${translations.contact.subtitleHighlight}`,
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
