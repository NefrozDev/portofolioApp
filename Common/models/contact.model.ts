export interface Contact {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}

export interface ContactSubmission extends Contact {
  // Hidden spam-trap field: people leave it empty, bots tend to fill it.
  website?: string;
}
