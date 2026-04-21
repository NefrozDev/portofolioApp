import { Router } from 'express';
import { Contact } from '../../../Common/models/contact.model';

const contactRouter = Router();

contactRouter.post('/', (req, res) => {
  const payload = req.body as Contact;

  if (!payload.name || !payload.email || !payload.message) {
    console.warn('Contact route: payload invalide reçu.');

    res.status(400).json({
      message: 'Invalid payload.'
    });

    return;
  }

  res.status(200).json({
    message: 'Votre message a bien été envoyé.'
  });
});

export { contactRouter };