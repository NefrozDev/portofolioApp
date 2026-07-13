import { Router } from 'express';
import { getAppTranslations } from '../../../Common/i18n';
import { Contact } from '../../../Common/models/contact.model';
import {
  ContactDelivery,
  ContactDeliveryConfigurationError,
  deliverContactMessage
} from '../services/contact-delivery';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseContact(payload: unknown): Contact | undefined {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return undefined;
  }

  const candidate = payload as Record<string, unknown>;
  const name = typeof candidate['name'] === 'string' ? candidate['name'].trim() : '';
  const message = typeof candidate['message'] === 'string'
    ? candidate['message'].trim()
    : '';
  const email = typeof candidate['email'] === 'string'
    ? candidate['email'].trim()
    : undefined;
  const phone = typeof candidate['phone'] === 'string'
    ? candidate['phone'].trim()
    : undefined;

  if (
    !name ||
    name.length > 100 ||
    !message ||
    message.length > 2000 ||
    (email && (email.length > 254 || !emailPattern.test(email))) ||
    (phone && phone.length > 50)
  ) {
    return undefined;
  }

  return {
    name,
    message,
    ...(email ? { email } : {}),
    ...(phone ? { phone } : {})
  };
}

function createContactRouter(deliver: ContactDelivery = deliverContactMessage) {
  const contactRouter = Router();

  contactRouter.post('/', async (req, res) => {
    const language = typeof req.query.lang === 'string' ? req.query.lang : undefined;
    const translations = getAppTranslations(language);
    const contact = parseContact(req.body);

    if (!contact) {
      res.status(400).json({
        message: translations.contact.feedback.invalidPayload
      });

      return;
    }

    try {
      await deliver(contact);

      res.status(200).json({
        message: translations.contact.feedback.success
      });
    } catch (error) {
      const isConfigurationError = error instanceof ContactDeliveryConfigurationError;

      console.error(
        isConfigurationError
          ? 'Contact route: email delivery is not configured.'
          : 'Contact route: email delivery failed.',
        error
      );

      res.status(isConfigurationError ? 503 : 502).json({
        message: translations.contact.feedback.submitError
      });
    }
  });

  return contactRouter;
}

const contactRouter = createContactRouter();

export {
  contactRouter,
  createContactRouter,
  parseContact
};
