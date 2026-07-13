import express from 'express';
import cors from 'cors';

import { healthRouter } from './src/routes/health.routes';
import { projectsRouter } from './src/routes/projects.routes';
import { experiencesRouter } from './src/routes/experiences.routes';
import { createContactRouter } from './src/routes/contact.routes';
import {
  ContactDelivery,
  deliverContactMessage
} from './src/services/contact-delivery';
import { env } from './config/env';

interface AppDependencies {
  deliverContactMessage?: ContactDelivery;
}

function createApp(dependencies: AppDependencies = {}) {
  const app = express();
  const contactDelivery = dependencies.deliverContactMessage ?? deliverContactMessage;

  app.disable('x-powered-by');
  app.use(cors({
    origin: env.allowedOrigins.length ? env.allowedOrigins : true
  }));
  app.use(express.json({ limit: '20kb' }));

  app.use('/api/health', healthRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/experiences', experiencesRouter);
  app.use('/api/contact', createContactRouter(contactDelivery));

  app.use((_req, res) => {
    res.status(404).json({ message: 'Not found.' });
  });

  return app;
}

const app = createApp();

export { app, createApp };
export default app;
