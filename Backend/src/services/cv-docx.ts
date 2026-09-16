import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  AlignmentType,
  BorderStyle,
  Document,
  ImageRun,
  OverlapType,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableAnchorType,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType
} from 'docx';

import { PORTFOLIO_PROFILE } from '../../../Common/constants/portfolio-profile';
import { getAppTranslations, getExperiencesForLanguage } from '../../../Common/i18n';
import { Experience, formatTechnologyTag } from '../../../Common/models/experience.model';
import { getLatestTechnologyTags } from './cv-pdf';

const COLORS = {
  navy: '0F172A',
  primary: '4F46E5',
  primarySoft: 'EEF2FF',
  heading: '172033',
  body: '334155',
  muted: '64748B',
  rule: 'DBE3EF',
  white: 'FFFFFF'
} as const;

const PAGE_WIDTH = 10000;
const A4_WIDTH = 11906;
const HERO_WIDTH = A4_WIDTH;
const HERO_PORTRAIT_WIDTH = 3900;
const HERO_ACCENT_WIDTH = 140;
const HERO_IMAGE_PATH = path.resolve(
  process.cwd(),
  '../portfolio/public/img/userpic-cv-circle.png'
);

async function loadHeroImage(): Promise<Buffer | undefined> {
  for (const candidate of [
    HERO_IMAGE_PATH,
    path.resolve(process.cwd(), 'portfolio/public/img/userpic.png')
  ]) {
    try {
      return await readFile(candidate);
    } catch {
      // The portrait is optional when the frontend assets are not deployed with the API.
    }
  }

  return undefined;
}

function noBorders() {
  return {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.NONE },
    insideVertical: { style: BorderStyle.NONE }
  };
}

function sectionHeading(title: string): Table {
  return new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    indent: { size: 700, type: WidthType.DXA },
    columnWidths: [90, PAGE_WIDTH - 90],
    layout: TableLayoutType.FIXED,
    borders: noBorders(),
    rows: [new TableRow({
      children: [
        new TableCell({
          width: { size: 90, type: WidthType.DXA },
          shading: { type: ShadingType.CLEAR, fill: COLORS.primary },
          borders: noBorders(),
          children: [new Paragraph({})]
        }),
        new TableCell({
          width: { size: PAGE_WIDTH - 90, type: WidthType.DXA },
          borders: {
            ...noBorders(),
            bottom: { style: BorderStyle.SINGLE, color: COLORS.rule, size: 6, space: 6 }
          },
          children: [new Paragraph({
            spacing: { before: 100, after: 100 },
            children: [new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 22,
              color: COLORS.heading
            })]
          })]
        })
      ]
    })]
  });
}

function skillParagraph(skills: string[]): Paragraph {
  return new Paragraph({
    indent: { left: 700, right: 1206 },
    spacing: { after: 150 },
    children: skills.flatMap((skill) => [
      new TextRun({
        text: ` ${skill} `,
        bold: true,
        size: 16,
        color: COLORS.primary,
        shading: { type: ShadingType.CLEAR, fill: COLORS.primarySoft },
        break: 0
      }),
      new TextRun({ text: '  ', size: 8 })
    ])
  });
}

function experienceRow(experience: Experience): TableRow {
  const technologies = experience.technologies.map(formatTechnologyTag).join('  •  ');
  const highlights = experience.highlights.map((highlight) => new Paragraph({
    indent: { left: 240, hanging: 240 },
    spacing: { after: 70 },
    children: [
      new TextRun({ text: '•  ', bold: true, size: 18, color: COLORS.primary }),
      new TextRun({ text: highlight, size: 18, color: COLORS.body })
    ]
  }));

  return new TableRow({
    children: [
      new TableCell({
        width: { size: 1800, type: WidthType.DXA },
        verticalAlign: 'top',
        borders: {
          ...noBorders(),
          right: { style: BorderStyle.SINGLE, color: COLORS.rule, size: 6 }
        },
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: experience.period, bold: true, size: 17, color: COLORS.primary })]
        })]
      }),
      new TableCell({
        width: { size: 220, type: WidthType.DXA },
        verticalAlign: 'top',
        borders: noBorders(),
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: '●', size: 18, color: COLORS.primary })]
        })]
      }),
      new TableCell({
        width: { size: 7980, type: WidthType.DXA },
        borders: noBorders(),
        children: [
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: experience.role, bold: true, size: 23, color: COLORS.heading })]
          }),
          new Paragraph({
            spacing: { after: 55 },
            children: [new TextRun({ text: experience.company, bold: true, size: 19, color: COLORS.primary })]
          }),
          new Paragraph({
            spacing: { after: 90 },
            children: [new TextRun({ text: technologies, italics: true, size: 16, color: COLORS.muted })]
          }),
          ...highlights
        ]
      })
    ]
  });
}

export async function createCvDocx(language?: string): Promise<Buffer> {
  const translations = getAppTranslations(language);
  const experiences = getExperiencesForLanguage(language);
  const skills = getLatestTechnologyTags(experiences).map(formatTechnologyTag);
  const heroImage = await loadHeroImage();
  const heroChildren = [
    new Paragraph({ spacing: { after: 70 }, children: [new TextRun({ text: translations.home.name, bold: true, size: 54, color: COLORS.white })] }),
    new Paragraph({ spacing: { after: 170 }, children: [new TextRun({ text: translations.home.position, size: 26, color: 'A5B4FC' })] }),
    new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: translations.home.description, italics: true, size: 21, color: 'E2E8F0' })] }),
    new Paragraph({ spacing: { after: 190 }, children: [new TextRun({ text: `${translations.contact.subtitle} ${translations.contact.subtitleHighlight}`, size: 19, color: 'CBD5E1' })] }),
    new Paragraph({ children: [new TextRun({ text: `${PORTFOLIO_PROFILE.email}    ${translations.contact.links.linkedin}`, bold: true, size: 19, color: 'CBD5E1' })] })
  ];

  const heroCells = [new TableCell({
    width: { size: HERO_ACCENT_WIDTH, type: WidthType.DXA },
    shading: { type: ShadingType.CLEAR, fill: COLORS.primary },
    borders: noBorders(),
    children: [new Paragraph({})]
  })] as TableCell[];
  if (heroImage) {
    heroCells.push(new TableCell({
      width: { size: HERO_PORTRAIT_WIDTH - HERO_ACCENT_WIDTH, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, fill: COLORS.navy },
      borders: noBorders(),
      verticalAlign: 'center',
      children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new ImageRun({ data: heroImage, type: 'png', transformation: { width: 189, height: 189 } })] })]
    }));
  }
  heroCells.push(new TableCell({
    width: {
      size: heroImage
        ? HERO_WIDTH - HERO_PORTRAIT_WIDTH
        : HERO_WIDTH - HERO_ACCENT_WIDTH,
      type: WidthType.DXA
    },
    shading: { type: ShadingType.CLEAR, fill: COLORS.navy },
    borders: noBorders(),
    children: heroChildren
  }));

  const document = new Document({
    creator: translations.home.name,
    title: `${translations.home.name} - ${translations.cv.title}`,
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: 20, color: COLORS.body, noProof: true }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          size: { width: A4_WIDTH, height: 16838 },
          margin: { top: 0, right: 0, bottom: 600, left: 0 }
        }
      },
      children: [
        new Table({
          width: { size: HERO_WIDTH, type: WidthType.DXA },
          float: {
            horizontalAnchor: TableAnchorType.PAGE,
            verticalAnchor: TableAnchorType.PAGE,
            absoluteHorizontalPosition: 0,
            absoluteVerticalPosition: 0,
            topFromText: 0,
            bottomFromText: 0,
            leftFromText: 0,
            rightFromText: 0,
            overlap: OverlapType.NEVER
          },
          layout: TableLayoutType.FIXED,
          columnWidths: heroImage
            ? [
              HERO_ACCENT_WIDTH,
              HERO_PORTRAIT_WIDTH - HERO_ACCENT_WIDTH,
              HERO_WIDTH - HERO_PORTRAIT_WIDTH
            ]
            : [HERO_ACCENT_WIDTH, HERO_WIDTH - HERO_ACCENT_WIDTH],
          borders: noBorders(),
          rows: [new TableRow({ children: heroCells })]
        }),
        sectionHeading(translations.cv.skills),
        skillParagraph(skills),
        sectionHeading(translations.cv.experience),
        new Table({
          width: { size: PAGE_WIDTH, type: WidthType.DXA },
          indent: { size: 700, type: WidthType.DXA },
          layout: TableLayoutType.FIXED,
          columnWidths: [1800, 220, 7980],
          borders: noBorders(),
          rows: experiences.map(experienceRow)
        })
      ]
    }]
  });

  return Packer.toBuffer(document);
}

export type CvDocxGenerator = typeof createCvDocx;
