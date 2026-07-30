import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const reportPath = join(
  process.cwd(),
  'coverage',
  'portfolio',
  'index.html'
);
const report = readFileSync(reportPath, 'utf8');
const percentages = [
  ...report.matchAll(/<span class="strong">([\d.]+)%\s*<\/span>/g)
].map((match) => Number(match[1]));
const metricNames = ['statements', 'branches', 'functions', 'lines'];
const thresholds = {
  statements: 80,
  branches: 60,
  functions: 80,
  lines: 80
};

if (percentages.length < metricNames.length) {
  throw new Error(`Unable to read coverage totals from ${reportPath}.`);
}

const failures = metricNames.flatMap((metric, index) => {
  const actual = percentages[index];
  const required = thresholds[metric];

  return actual < required
    ? [`${metric}: ${actual}% (required: ${required}%)`]
    : [];
});

if (failures.length) {
  console.error('Coverage thresholds were not met:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Coverage thresholds passed: ${metricNames
    .map((metric, index) => `${metric} ${percentages[index]}%`)
    .join(', ')}.`
);
