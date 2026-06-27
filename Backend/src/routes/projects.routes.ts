import { Router } from 'express';
import { getProjectsForLanguage } from '../../../Common/i18n';

const projectsRouter = Router();

projectsRouter.get('/', (req, res) => {
  const language = typeof req.query.lang === 'string' ? req.query.lang : undefined;

  res.status(200).json(getProjectsForLanguage(language));
});

export { projectsRouter };
