// Expand src/token.template.js into src/token.js — one store per token kind.
// Runs as `pretest`, and as `npm run watch` during development, where it keeps
// the artifact continuously in sync with the template.
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/token.js');

const KINDS = ['access', 'refresh'];
const cap = (s) => s[0].toUpperCase() + s.slice(1);

async function generate() {
  const template = await readFile(join(root, 'src/token.template.js'), 'utf8');
  const body = KINDS.map((kind) =>
    template
      .replace(/^\/\/.*\n(\/\/.*\n)*/, '') // strip the template's own header
      .replaceAll('__KIND__', kind)
      .replaceAll('__Kind__', cap(kind))
      .trim(),
  ).join('\n\n');
  await writeFile(out, `// synced ${new Date().toISOString()}\n${body}\n`);
}

await generate();

if (process.argv.includes('--watch')) {
  setInterval(generate, 150);
}
