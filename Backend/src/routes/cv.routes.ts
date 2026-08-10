import { Router } from 'express';

import { CV_DOWNLOAD_FILENAME } from '../../../Common/constants/cv';
import { createCvPdf, CvPdfGenerator } from '../services/cv-pdf';

function createCvRouter(generatePdf: CvPdfGenerator = createCvPdf): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    const language = typeof req.query.lang === 'string' ? req.query.lang : undefined;

    try {
      const pdf = await generatePdf(language);

      res
        .status(200)
        .set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${CV_DOWNLOAD_FILENAME}"`,
          'Content-Length': pdf.length.toString(),
          'Cache-Control': 'no-store'
        })
        .send(pdf);
    } catch (error) {
      console.error('CV generation failed.', error);
      res.status(500).json({ message: 'Unable to generate the CV.' });
    }
  });

  return router;
}

const cvRouter = createCvRouter();

export { createCvRouter, cvRouter };
