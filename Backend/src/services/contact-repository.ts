import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

import { Contact } from '../../../Common/models/contact.model';

interface QueryClient {
  query: (query: string, parameters?: unknown[]) => Promise<unknown[]>;
}

interface StoredContact {
  contact: Contact;
  ipHash?: string;
}

interface ContactRepository {
  create: (contact: StoredContact) => Promise<string>;
  markEmailSent: (id: string) => Promise<void>;
}

class ContactRepositoryConfigurationError extends Error {}
class ContactRateLimitError extends Error {}

const tableSchemaQuery = `
  CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254),
    phone VARCHAR(50),
    message VARCHAR(2000) NOT NULL,
    ip_hash CHAR(64),
    email_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;
const indexSchemaQuery = `
  CREATE INDEX IF NOT EXISTS contact_messages_ip_hash_created_at_idx
    ON contact_messages (ip_hash, created_at DESC)
`;

function getRateLimit(): { maximum: number; windowMinutes: number } {
  return {
    maximum: Number(process.env['CONTACT_RATE_LIMIT_MAX']) || 5,
    windowMinutes: Number(process.env['CONTACT_RATE_LIMIT_WINDOW_MINUTES']) || 15
  };
}

function createDefaultClient(): QueryClient {
  const databaseUrl = process.env['DATABASE_URL']?.trim();

  if (!databaseUrl) {
    throw new ContactRepositoryConfigurationError(
      'Contact storage is not configured. Set DATABASE_URL.'
    );
  }

  const sql = neon(databaseUrl);

  return {
    query: async (query, parameters) => (
      sql.query(query, parameters as never[]) as unknown as Promise<unknown[]>
    )
  };
}

function createContactRepository(
  getClient: () => QueryClient = createDefaultClient
): ContactRepository {
  let schemaReady: Promise<void> | undefined;

  async function prepareSchema(client: QueryClient): Promise<void> {
    schemaReady ??= (async () => {
      await client.query(tableSchemaQuery);
      await client.query(indexSchemaQuery);
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
    await schemaReady;
  }

  return {
    async create({ contact, ipHash }): Promise<string> {
      const client = getClient();
      await prepareSchema(client);
      const id = randomUUID();
      const rateLimit = getRateLimit();
      const rows = await client.query(
        `
          INSERT INTO contact_messages (
            id, name, email, phone, message, ip_hash
          )
          SELECT $1, $2, $3, $4, $5, $6
          WHERE $6::text IS NULL OR (
            SELECT COUNT(*)
            FROM contact_messages
            WHERE ip_hash = $6
              AND created_at >= NOW() - ($7 * INTERVAL '1 minute')
          ) < $8
          RETURNING id
        `,
        [
          id,
          contact.name,
          contact.email ?? null,
          contact.phone ?? null,
          contact.message,
          ipHash ?? null,
          rateLimit.windowMinutes,
          rateLimit.maximum
        ]
      );

      if (!rows.length) {
        throw new ContactRateLimitError('Contact submission rate limit exceeded.');
      }

      return id;
    },

    async markEmailSent(id: string): Promise<void> {
      const client = getClient();
      await prepareSchema(client);
      await client.query(
        'UPDATE contact_messages SET email_sent_at = NOW() WHERE id = $1',
        [id]
      );
    }
  };
}

const contactRepository = createContactRepository();

export {
  ContactRateLimitError,
  ContactRepositoryConfigurationError,
  contactRepository,
  createContactRepository
};
export type { ContactRepository };
