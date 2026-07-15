import { Contact } from '../../../Common/models/contact.model';

interface ContactDeliveryConfig {
  apiKey: string;
  from: string;
  to: string;
}

type Fetch = typeof fetch;
const defaultContactRecipient = 'demoorsteven@yahoo.com';

class ContactDeliveryConfigurationError extends Error {}

function getContactDeliveryConfig(): ContactDeliveryConfig {
  const apiKey = process.env['RESEND_API_KEY']?.trim();
  const from = process.env['CONTACT_FROM_EMAIL']?.trim();
  const to = process.env['CONTACT_TO_EMAIL']?.trim() || defaultContactRecipient;

  if (!apiKey || !from) {
    throw new ContactDeliveryConfigurationError(
      'Contact delivery is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL.'
    );
  }

  return { apiKey, from, to };
}

function createContactDelivery(fetchRequest: Fetch = fetch) {
  return async (contact: Contact): Promise<void> => {
    const config = getContactDeliveryConfig();
    const contactDetails = [
      `Name: ${contact.name}`,
      `Email: ${contact.email ?? 'Not provided'}`,
      `Phone: ${contact.phone ?? 'Not provided'}`,
      '',
      contact.message
    ].join('\n');

    const response = await fetchRequest('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'portfolio-contact-form/1.0'
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        subject: `Portfolio contact from ${contact.name}`,
        text: contactDetails,
        ...(contact.email ? { reply_to: contact.email } : {})
      })
    });

    if (!response.ok) {
      throw new Error(`Resend rejected the contact email with status ${response.status}.`);
    }
  };
}

const deliverContactMessage = createContactDelivery();

export {
  ContactDeliveryConfigurationError,
  createContactDelivery,
  deliverContactMessage
};
export type ContactDelivery = ReturnType<typeof createContactDelivery>;
