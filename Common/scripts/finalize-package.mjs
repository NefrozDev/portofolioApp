import { writeFile } from 'node:fs/promises';

const packageMetadata = `${JSON.stringify({ type: 'module' }, null, 2)}\n`;

await writeFile(new URL('../dist/package.json', import.meta.url), packageMetadata);
