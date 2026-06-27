import { spawnSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const sourceRoot = join(backendRoot, 'src');

function collectSpecFiles(directory) {
  return readdirSync(directory)
    .flatMap((entry) => {
      const fullPath = join(directory, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        return collectSpecFiles(fullPath);
      }

      return entry.endsWith('.spec.ts') ? [fullPath] : [];
    })
    .sort();
}

const specFiles = collectSpecFiles(sourceRoot).map((file) =>
  relative(backendRoot, file)
);

if (!specFiles.length) {
  console.error('No backend spec files found.');
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', '--test', ...specFiles],
  {
    cwd: backendRoot,
    stdio: 'inherit'
  }
);

process.exit(result.status ?? 1);
