import express, { Request } from 'express';
import cors from 'cors';

import { healthRouter } from './src/routes/health.routes';
import { projectsRouter } from './src/routes/projects.routes';
import { experiencesRouter } from './src/routes/experiences.routes';
import { createContactRouter } from './src/routes/contact.routes';
import { createCvRouter } from './src/routes/cv.routes';
import { createCvPdf, CvPdfGenerator } from './src/services/cv-pdf';
import { createCvDocx, CvDocxGenerator } from './src/services/cv-docx';
import {
  ContactDelivery,
  deliverContactMessage
} from './src/services/contact-delivery';
import {
  ContactRepository,
  contactRepository
} from './src/services/contact-repository';
import { env } from './config/env';

interface AppDependencies {
  deliverContactMessage?: ContactDelivery;
  contactRepository?: ContactRepository;
  getContactIpHash?: (request: Request) => string | undefined;
  generateCvPdf?: CvPdfGenerator;
  generateCvDocx?: CvDocxGenerator;
}

function createApp(dependencies: AppDependencies = {}) {
  const app = express();
  const contactDelivery = dependencies.deliverContactMessage ?? deliverContactMessage;
  const repository = dependencies.contactRepository ?? contactRepository;

  app.disable('x-powered-by');
  app.use(cors({
    origin: env.isVercel || env.hasConfiguredOrigins
      ? env.allowedOrigins
      : true
  }));
  app.use(express.json({ limit: '20kb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/experiences', experiencesRouter);
  app.use('/api/cv', createCvRouter(
    dependencies.generateCvPdf ?? createCvPdf,
    dependencies.generateCvDocx ?? createCvDocx
  ));
  app.use('/api/contact', createContactRouter({
    deliver: contactDelivery,
    repository,
    ...(dependencies.getContactIpHash
      ? { getIpHash: dependencies.getContactIpHash }
      : {})
  }));

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not found.' });
  });

  return app;
}

const app = createApp();

export { app, createApp };
export default app;
