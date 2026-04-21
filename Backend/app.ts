import express from 'express';
import cors from 'cors';

import { healthRouter } from './src/routes/health.routes';
import { projectsRouter } from './src/routes/projects.routes';
import { experiencesRouter } from './src/routes/experiences.routes';
import { contactRouter } from './src/routes/contact.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/experiences', experiencesRouter);
app.use('/api/contact', contactRouter);

export { app };