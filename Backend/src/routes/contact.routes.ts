import { Router } from 'express';
import { getAppTranslations } from '../../../Common/i18n';
import { Contact } from '../../../Common/models/contact.model';

const contactRouter = Router();

contactRouter.post('/', (req, res) => {
  const language = typeof req.query.lang === 'string' ? req.query.lang : undefined;
  const translations = getAppTranslations(language);
  const payload = req.body as Contact;

  if (!payload.name || !payload.message) {
    console.warn('Contact route: invalid payload received.');

    res.status(400).json({
      message: translations.contact.feedback.invalidPayload
    });

    return;
  }

  res.status(200).json({
    message: translations.contact.feedback.success
  });
});

export { contactRouter };
