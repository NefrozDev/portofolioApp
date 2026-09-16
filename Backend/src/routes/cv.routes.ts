import { Router } from 'express';

import {
  CV_DOWNLOAD_FILENAME,
  CV_WORD_DOWNLOAD_FILENAME
} from '../../../Common/constants/cv';
import { createCvDocx, CvDocxGenerator } from '../services/cv-docx';
import { createCvPdf, CvPdfGenerator } from '../services/cv-pdf';

function createCvRouter(
  generatePdf: CvPdfGenerator = createCvPdf,
  generateDocx: CvDocxGenerator = createCvDocx
): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    const language = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const isWordDownload = req.query.format === 'docx';

    try {
      const document = isWordDownload
        ? await generateDocx(language)
        : await generatePdf(language);

      res
        .status(200)
        .set({
          'Content-Type': isWordDownload
            ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : 'application/pdf',
          'Content-Disposition': `attachment; filename="${
            isWordDownload ? CV_WORD_DOWNLOAD_FILENAME : CV_DOWNLOAD_FILENAME
          }"`,
          'Content-Length': document.length.toString(),
          'Cache-Control': 'no-store'
        })
        .send(document);
    } catch (error) {
      console.error('CV generation failed.', error);
      res.status(500).json({ message: 'Unable to generate the CV.' });
    }
  });

  return router;
}

const cvRouter = createCvRouter();

export { createCvRouter, cvRouter };
