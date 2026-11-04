// Falha o build se uma lição existir em src/content/docs e não estiver no sidebar (ou o contrário).
// O sidebar tem rótulos curtos escritos à mão em astro.config.mjs; lição nova precisa de uma linha lá.
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const docs = fileURLToPath(new URL('../src/content/docs/', import.meta.url));
const config = await readFile(fileURLToPath(new URL('../astro.config.mjs', import.meta.url)), 'utf8');

const noMenu = new Set([...config.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]));

const arquivos = [];
for (const e of await readdir(docs, { recursive: true })) {
  if (!e.endsWith('.md')) continue;
  const slug = e.replace(/\.md$/, '').replace(/\/index$/, '');
  if (slug !== 'index' && slug !== '404') arquivos.push(slug);
}

const fora = arquivos.filter((s) => !noMenu.has(s));
const sobrando = [...noMenu].filter((s) => !arquivos.includes(s) && !s.startsWith('curso-mdm-como-codigo')); // o curso é opcional (ver TEM_CURSO)

if (fora.length || sobrando.length) {
  if (fora.length) console.error('Lições fora do sidebar (astro.config.mjs):\n  ' + fora.join('\n  '));
  if (sobrando.length) console.error('Slugs do sidebar sem arquivo:\n  ' + sobrando.join('\n  '));
  process.exit(1);
}
console.log(`sidebar ok: ${arquivos.length} páginas listadas`);
