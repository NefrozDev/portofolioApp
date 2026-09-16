import { readFile } from 'node:fs/promises';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import {
  AlignmentType, BorderStyle, Document, ExternalHyperlink, Footer, Header,
  HeightRule, ImageRun, ImportedXmlComponent, IRunOptions, LineRuleType,
  OverlapType, Packer, Paragraph, ShadingType, SimpleField, Table,
  TableAnchorType, TableCell, TableLayoutType, TableRow, TabStopType,
  TextRun, WidthType
} from 'docx';

import { PORTFOLIO_PROFILE } from '../../../Common/constants/portfolio-profile';
import { getAppTranslations, getExperiencesForLanguage } from '../../../Common/i18n';
import { Experience, formatTechnologyTag } from '../../../Common/models/experience.model';
import { getLatestTechnologyTags } from './cv-pdf';

const COLORS = {
  navy: '0F172A', primary: '4F46E5', primarySoft: 'EEF2FF',
  heading: '172033', body: '334155', muted: '64748B', rule: 'DBE3EF', white: 'FFFFFF'
} as const;

// PDF points converted to Word twips. Keep the same A4 geometry as cv-pdf.ts.
const pt = (value: number) => Math.round(value * 20);
const PAGE_WIDTH = 11906;
const MARGIN = pt(46);
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
const ZERO_MARGINS = { top: 0, bottom: 0, left: 0, right: 0 };
const BORDERS = {
  top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE },
  left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
  insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE }
};

function run(text: string, options: IRunOptions = {}): TextRun {
  return new TextRun({ text, font: 'Arial', size: 18, color: COLORS.body, noProof: true, ...options });
}

function spacer(points: number): Paragraph {
  return new Paragraph({
    spacing: { before: 0, after: 0, line: pt(points), lineRule: LineRuleType.EXACT },
    children: [run('', { size: 2 })]
  });
}

async function loadHeroImage(): Promise<Buffer | undefined> {
  for (const candidate of [
    path.resolve(process.cwd(), '../portfolio/public/img/userpic-cv-circle.png'),
    path.resolve(process.cwd(), 'portfolio/public/img/userpic-cv-circle.png')
  ]) {
    try {
      return await readFile(candidate);
    } catch {
      // Assets can be served separately in a standalone backend deployment.
    }
  }
  try {
    const response = await fetch('https://www.synapseengineering.dev/img/userpic-cv-circle.png', {
      signal: AbortSignal.timeout(4_000)
    });
    if (response.ok) return Buffer.from(await response.arrayBuffer());
  } catch {
    // Keep the portrait column in place even if the image is unavailable.
  }
  return undefined;
}

// Native Office rounded text boxes keep badges editable and avoid rasterized text.
function roundedBox(id: string, width: number, height: number, fill: string, text = '', color: string = COLORS.primary): TextRun {
  const picture = new ImportedXmlComponent('w:pict');
  const shape = new ImportedXmlComponent('v:roundrect', {
    id, style: `width:${width}pt;height:${height}pt;v-text-anchor:middle;mso-wrap-distance-left:0;mso-wrap-distance-right:0`,
    arcsize: '50%', stroked: 'f', fillcolor: `#${fill}`
  });
  const textbox = new ImportedXmlComponent('v:textbox', { inset: '0,0,0,0' });
  const content = new ImportedXmlComponent('w:txbxContent');
  content.push(new Paragraph({ alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 0, line: pt(10), lineRule: LineRuleType.EXACT },
    children: [run(text, { bold: true, size: 16, color })]
  }));
  textbox.push(content);
  shape.push(textbox);
  picture.push(shape);
  return new TextRun({ children: [picture], noProof: true, position: text ? undefined : '-9pt' });
}

function sectionHeading(title: string): Paragraph[] {
  return [
    new Paragraph({
      keepNext: true,
      indent: { left: pt(13) },
      border: { left: { style: BorderStyle.SINGLE, color: COLORS.primary, size: 24, space: 10 } },
      spacing: { before: 0, after: pt(6), line: pt(15), lineRule: LineRuleType.EXACT },
      children: [run(title.toUpperCase(), { bold: true, size: 22, color: COLORS.heading })]
    }),
    new Paragraph({
      keepNext: true, indent: { left: pt(13) },
      spacing: { before: 0, after: pt(9), line: 1, lineRule: LineRuleType.EXACT },
      border: { bottom: { style: BorderStyle.SINGLE, color: COLORS.rule, size: 6 } },
      children: [run('', { size: 2 })]
    })
  ];
}

function skillParagraphs(skills: string[]): Paragraph[] {
  const metrics = new PDFDocument({ autoFirstPage: false });
  metrics.font('Helvetica-Bold').fontSize(8);
  const rows: TextRun[][] = [[]];
  let rowWidth = 0;
  skills.forEach((skill, index) => {
    const width = metrics.widthOfString(skill) + 14;
    if (rowWidth + width > CONTENT_WIDTH / 20) {
      rows.push([]);
      rowWidth = 0;
    }
    if (rowWidth) rows.at(-1)!.push(run(' ', { size: 16, characterSpacing: 75 }));
    rows.at(-1)!.push(roundedBox(`skill-${index}`, width, 19, COLORS.primarySoft, skill));
    rowWidth += width + 6;
  });
  metrics.end();
  return rows.map((children) => new Paragraph({
    keepNext: true,
    spacing: { before: 0, after: 0, line: pt(25), lineRule: LineRuleType.EXACT },
    children
  }));
}

function experienceTable(experience: Experience): Table {
  const widths = [pt(92), pt(10), pt(10), CONTENT_WIDTH - pt(112)];
  const row = (details: Paragraph[], first: boolean) => new TableRow({ cantSplit: true, children: [
    new TableCell({ width: { size: widths[0], type: WidthType.DXA }, borders: BORDERS, margins: ZERO_MARGINS, children: [
      new Paragraph({ alignment: AlignmentType.RIGHT, spacing: { before: pt(2), after: 0 }, children: [run(first ? experience.period : '', { size: 17, bold: true, color: COLORS.primary })] })
    ] }),
    new TableCell({ width: { size: widths[1], type: WidthType.DXA }, borders: BORDERS, margins: ZERO_MARGINS, children: [spacer(1)] }),
    new TableCell({ width: { size: widths[2], type: WidthType.DXA }, borders: {
      ...BORDERS, left: { style: BorderStyle.SINGLE, color: COLORS.rule, size: 6 }
    }, margins: ZERO_MARGINS, children: [
      new Paragraph({ children: [run(first ? '●' : '', { size: 16, color: COLORS.primary })] })
    ] }),
    new TableCell({ width: { size: widths[3], type: WidthType.DXA }, margins: ZERO_MARGINS, borders: BORDERS, children: details })
  ] });
  const highlights = experience.highlights.map((highlight) => new Paragraph({
    keepLines: true,
    indent: { left: pt(13), hanging: pt(13) },
    tabStops: [{ type: TabStopType.LEFT, position: pt(13) }],
    spacing: { after: pt(5), line: pt(12), lineRule: LineRuleType.AT_LEAST },
    children: [run('•\t', { color: COLORS.primary }), run(highlight)]
  }));
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: widths, layout: TableLayoutType.FIXED, borders: BORDERS, margins: ZERO_MARGINS,
    rows: [row([
        new Paragraph({ keepNext: true, spacing: { after: pt(4) }, children: [run(experience.role, { size: 23, bold: true, color: COLORS.heading })] }),
        new Paragraph({ keepNext: true, spacing: { after: pt(5) }, children: [run(experience.company, { size: 19, bold: true, color: COLORS.primary })] }),
        new Paragraph({ keepNext: true, spacing: { after: pt(9), line: pt(10.75), lineRule: LineRuleType.AT_LEAST }, children: [run(experience.technologies.map(formatTechnologyTag).join('  •  '), { size: 16, italics: true, color: COLORS.muted })] }),
        ...highlights.slice(0, 2)
      ], true),
        ...highlights.slice(2).map((highlight) => row([highlight], false))
    ]
  });
}

function hero(translations: ReturnType<typeof getAppTranslations>, portrait: Buffer | undefined): Table {
  const widths = [pt(37), pt(142), pt(24), PAGE_WIDTH - pt(258), pt(46)];
  const copy = (text: string, size: number, color: string, after: number, bold = false, italics = false) => new Paragraph({
    spacing: { after: pt(after), line: pt(size / 2 + 3), lineRule: LineRuleType.AT_LEAST },
    children: [run(text, { size, color, bold, italics })]
  });
  const contacts = new Paragraph({
    tabStops: [{ type: TabStopType.LEFT, position: pt(183) }],
    children: [
      run('✉  ', { font: 'Segoe UI Symbol', size: 30, color: 'A5B4FC' }),
      new ExternalHyperlink({ link: `mailto:${PORTFOLIO_PROFILE.email}`, children: [run(PORTFOLIO_PROFILE.email, { size: 20, bold: true, color: 'CBD5E1' })] }),
      run('\t'), run(' in ', { size: 15, bold: true, color: COLORS.navy, shading: { type: ShadingType.CLEAR, fill: '818CF8' } }), run('  '),
      new ExternalHyperlink({ link: PORTFOLIO_PROFILE.linkedInUrl, children: [run(translations.contact.links.linkedin, { size: 20, bold: true, color: 'CBD5E1' })] })
    ]
  });
  const content = new Table({
    width: { size: PAGE_WIDTH - pt(9), type: WidthType.DXA },
    columnWidths: widths, layout: TableLayoutType.FIXED, margins: ZERO_MARGINS, borders: BORDERS,
    rows: [new TableRow({ cantSplit: true,
      children: widths.map((width, index) => new TableCell({
        width: { size: width, type: WidthType.DXA },
        borders: BORDERS, margins: ZERO_MARGINS,
        children: index === 1 && portrait ? [spacer(6), new Paragraph({ children: [new ImageRun({
          type: 'png', data: portrait, transformation: { width: 142 * 4 / 3, height: 142 * 4 / 3 },
          altText: { name: 'Portrait', description: 'Steven De Moor', title: 'Portrait' }
        })] })] : index === 3 ? [
          copy(translations.home.name, 54, COLORS.white, 7, true),
          copy(translations.home.position, 26, 'A5B4FC', 10),
          copy(translations.home.description, 21.6, 'E2E8F0', 9, false, true),
          copy(`${translations.contact.subtitle} ${translations.contact.subtitleHighlight}`, 19.6, 'CBD5E1', 33),
          contacts
        ] : [spacer(1)]
      }))
    })]
  });
  return new Table({
    width: { size: PAGE_WIDTH, type: WidthType.DXA },
    columnWidths: [pt(9), PAGE_WIDTH - pt(9)], layout: TableLayoutType.FIXED,
    margins: ZERO_MARGINS, borders: BORDERS,
    float: { horizontalAnchor: TableAnchorType.PAGE, verticalAnchor: TableAnchorType.PAGE,
      absoluteHorizontalPosition: 0, absoluteVerticalPosition: 0, overlap: OverlapType.NEVER,
      leftFromText: 0, rightFromText: 0, topFromText: 0, bottomFromText: 0 },
    rows: [new TableRow({ height: { value: pt(200), rule: HeightRule.EXACT }, cantSplit: true, children: [
      new TableCell({ width: { size: pt(9), type: WidthType.DXA }, margins: ZERO_MARGINS, borders: BORDERS,
        shading: { type: ShadingType.CLEAR, fill: COLORS.primary }, children: [spacer(1)] }),
      new TableCell({ width: { size: PAGE_WIDTH - pt(9), type: WidthType.DXA }, margins: { ...ZERO_MARGINS, top: pt(19) }, borders: BORDERS,
        shading: { type: ShadingType.CLEAR, fill: COLORS.navy }, children: [content, spacer(1)] })
    ] })]
  });
}

export async function createCvDocx(language?: string): Promise<Buffer> {
  const translations = getAppTranslations(language);
  const experiences = getExperiencesForLanguage(language);
  const portrait = await loadHeroImage();
  const pageField = (instruction: string) => {
    const field = new SimpleField(instruction);
    field.addChildElement(run('1', { size: 16, color: COLORS.muted }));
    return field;
  };
  const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [
    pageField('PAGE'), run(' / ', { size: 16, color: COLORS.muted }), pageField('NUMPAGES')
  ] })] });
  const document = new Document({
    creator: translations.home.name, title: `${translations.home.name} - ${translations.cv.title}`,
    styles: { default: { document: {
      run: { font: 'Arial', size: 18, color: COLORS.body, noProof: true },
      paragraph: { spacing: { before: 0, after: 0, line: 240, lineRule: LineRuleType.AUTO } }
    } } },
    sections: [{
      properties: { titlePage: true, page: {
        size: { width: PAGE_WIDTH, height: 16838 },
        margin: { top: pt(64), right: MARGIN, bottom: pt(70), left: MARGIN, header: pt(26), footer: pt(42) }
      } },
      headers: {
        first: new Header({ children: [hero(translations, portrait), spacer(1)] }),
        default: new Header({ children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
          spacing: { after: pt(9) }, border: { bottom: { style: BorderStyle.SINGLE, color: COLORS.rule, size: 6, space: 8 } },
          children: [run(translations.home.name, { bold: true, size: 23, color: COLORS.heading }), run(`\t${translations.home.position}`, { size: 17, color: COLORS.muted })]
        })] })
      },
      footers: { first: footer, default: footer },
      children: [
        spacer(24),
        ...sectionHeading(translations.cv.skills),
        ...skillParagraphs(getLatestTechnologyTags(experiences).map(formatTechnologyTag)),
        spacer(15),
        ...sectionHeading(translations.cv.experience),
        ...experiences.flatMap((experience) => [experienceTable(experience), spacer(14)])
      ]
    }]
  });
  return Packer.toBuffer(document);
}

export type CvDocxGenerator = typeof createCvDocx;
