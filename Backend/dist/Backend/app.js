"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const health_routes_1 = require("./src/routes/health.routes");
const projects_routes_1 = require("./src/routes/projects.routes");
const experiences_routes_1 = require("./src/routes/experiences.routes");
const contact_routes_1 = require("./src/routes/contact.routes");
const cv_routes_1 = require("./src/routes/cv.routes");
const cv_pdf_1 = require("./src/services/cv-pdf");
const cv_docx_1 = require("./src/services/cv-docx");
const contact_delivery_1 = require("./src/services/contact-delivery");
const contact_repository_1 = require("./src/services/contact-repository");
const env_1 = require("./config/env");
function createApp(dependencies = {}) {
    const app = (0, express_1.default)();
    const contactDelivery = dependencies.deliverContactMessage ?? contact_delivery_1.deliverContactMessage;
    const repository = dependencies.contactRepository ?? contact_repository_1.contactRepository;
    app.disable('x-powered-by');
    app.use((0, cors_1.default)({
        origin: env_1.env.isVercel || env_1.env.hasConfiguredOrigins
            ? env_1.env.allowedOrigins
            : true
    }));
    app.use(express_1.default.json({ limit: '20kb' }));
    app.use('/api/health', health_routes_1.healthRouter);
    app.use('/api/projects', projects_routes_1.projectsRouter);
    app.use('/api/experiences', experiences_routes_1.experiencesRouter);
    app.use('/api/cv', (0, cv_routes_1.createCvRouter)(dependencies.generateCvPdf ?? cv_pdf_1.createCvPdf, dependencies.generateCvDocx ?? cv_docx_1.createCvDocx));
    app.use('/api/contact', (0, contact_routes_1.createContactRouter)({
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
exports.app = app;
exports.default = app;
