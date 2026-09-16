import assert from 'node:assert/strict';
import test from 'node:test';
import JSZip from 'jszip';

import { AppLanguage } from '../../../Common/enums/app-language.enum';
import { getAppTranslations, getExperiencesForLanguage } from '../../../Common/i18n';
import { formatTechnologyTag } from '../../../Common/models/experience.model';
import { PORTFOLIO_PROFILE } from '../../../Common/constants/portfolio-profile';
import { createCvDocx } from './cv-docx';
import { getLatestTechnologyTags } from './cv-pdf';

function xmlText(xml: string): string {
  return [...xml.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)]
    .map((match) => match[1].replace(/&apos;/g, "'").replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'))
    .join('\n');
}

test('Word CV preserves editable localized content and individual rounded skill tags in every language', async () => {
  for (const language of Object.values(AppLanguage)) {
    const archive = await JSZip.loadAsync(await createCvDocx(language));
    const xml = await archive.file('word/document.xml')!.async('string');
    const text = xmlText(xml);
    const translations = getAppTranslations(language);
    const experiences = getExperiencesForLanguage(language);
    const skills = getLatestTechnologyTags(experiences).map(formatTechnologyTag);

    assert.ok(text.includes(translations.cv.skills.toUpperCase()), language);
    assert.ok(text.includes(translations.cv.experience.toUpperCase()), language);
    for (const experience of experiences) {
      for (const value of [experience.period, experience.role, experience.company, ...experience.highlights]) {
        assert.ok(text.includes(value), `${language}: missing ${value}`);
      }
    }
    assert.equal((xml.match(/<v:roundrect\b/g) ?? []).length, skills.length);
    for (const skill of skills) assert.ok(text.includes(skill), skill);
    assert.doesNotMatch(xml, /<undefined[\s>]/);
    // Adjacent tables can be merged by Word, changing column widths and indentation.
    assert.doesNotMatch(xml, /<\/w:tbl>\s*<w:tbl>/);
    assert.match(xml, /<w:cantSplit\s*\/>/);
  }
});

test('Word CV isolates the full-page first banner from the inset body and continuation header', async () => {
  const archive = await JSZip.loadAsync(await createCvDocx('fr'));
  const xml = await archive.file('word/document.xml')!.async('string');
  const headers = await Promise.all(Object.keys(archive.files)
    .filter((name) => /^word\/header\d+\.xml$/.test(name))
    .map((name) => archive.file(name)!.async('string')));
  const hero = headers.find((header) => header.includes('w:fill="0F172A"'))!;

  assert.ok(hero);
  assert.match(hero, /<w:tblW w:type="dxa" w:w="11906"/);
  assert.match(hero, /w:horzAnchor="page"/);
  assert.match(hero, /w:tblpX="0"/);
  assert.match(hero, /w:tblpY="0"/);
  assert.match(hero, /<w:trHeight w:val="4000" w:hRule="exact"/);
  assert.match(hero, /w:fill="4F46E5"/);
  assert.match(hero, /<w:hyperlink\b/);
  assert.ok(xmlText(hero).includes(PORTFOLIO_PROFILE.email));
  assert.match(xml, /w:left="920"/);
  assert.match(xml, /w:right="920"/);
  assert.match(xml, /<w:titlePg/);
  assert.equal(headers.length, 2);

  const footers = await Promise.all(Object.keys(archive.files)
    .filter((name) => /^word\/footer\d+\.xml$/.test(name))
    .map((name) => archive.file(name)!.async('string')));
  for (const footer of footers) {
    assert.match(footer, /w:instr="PAGE"/);
    assert.match(footer, /w:instr="NUMPAGES"/);
  }
});
