import { Router } from 'express';
import { getExperiencesForLanguage } from '../../../Common/i18n';

const experiencesRouter = Router();

experiencesRouter.get('/', (req, res) => {
  const language = typeof req.query.lang === 'string' ? req.query.lang : undefined;

  res.status(200).json(getExperiencesForLanguage(language));
});

export { experiencesRouter };
