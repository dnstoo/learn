// Gera public/llms.txt (índice) e public/llms-full.txt (conteúdo completo em Markdown)
// a partir das lições em src/content/docs. Roda automaticamente antes do build.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SITE = 'https://blog.deividsantos.com.br';
const NOME = 'Aprenda Modern Workplace';
const RESUMO =
  'Tutoriais em português sobre MDM, Jamf Pro, infraestrutura como código (IaC) e experiência digital do colaborador (DEX) para frotas Apple em ambientes corporativos. Autor: Deívid Santos. Conteúdo independente, sem afiliação com Apple, Jamf ou Microsoft.';

const docsDir = fileURLToPath(new URL('../src/content/docs/', import.meta.url));
const publicDir = fileURLToPath(new URL('../public/', import.meta.url));

const SECOES = [
  { titulo: 'Comece por aqui', arquivos: ['roadmap.md', 'sobre.md'] },
  { titulo: 'Fundamentos de MDM e ABM', dir: 'fundamentos' },
  { titulo: 'Jamf Pro na prática', dir: 'jamf-pro' },
  { titulo: 'IaC para dispositivos', dir: 'iac' },
  { titulo: 'DEX: experiência do colaborador', dir: 'dex' },
  { titulo: 'Modern Workplace', dir: 'modern-workplace' },
];

function ler(bruto) {
  const m = bruto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { titulo: '', descricao: '', ordem: 999, corpo: bruto.trim() };
  const fm = m[1];
  const pegar = (k) => {
    const r = fm.match(new RegExp('^' + k + ':\\s*(.+)$', 'm'));
    return r ? r[1].trim().replace(/^["']|["']$/g, '') : '';
  };
  const ordem = fm.match(/^\s+order:\s*(\d+)/m);
  return { titulo: pegar('title'), descricao: pegar('description'), ordem: ordem ? Number(ordem[1]) : 999, corpo: m[2].trim() };
}

async function carregar(relativo) {
  const bruto = await readFile(path.join(docsDir, relativo), 'utf8');
  const slug = relativo.replace(/\.mdx?$/, '').split(path.sep).join('/');
  return { ...ler(bruto), url: `${SITE}/${slug}/` };
}

const secoes = [];
for (const s of SECOES) {
  let nomes = s.arquivos ?? [];
  if (s.dir) {
    const lista = await readdir(path.join(docsDir, s.dir));
    nomes = lista.filter((f) => /\.mdx?$/.test(f)).map((f) => path.join(s.dir, f));
  }
  const paginas = [];
  for (const n of nomes) paginas.push(await carregar(n));
  if (s.dir) paginas.sort((a, b) => a.ordem - b.ordem || a.url.localeCompare(b.url));
  secoes.push({ titulo: s.titulo, paginas });
}

let indice = `# ${NOME}\n\n> ${RESUMO}\n\n`;
let completo = `# ${NOME}\n\n> ${RESUMO}\n\nSite: ${SITE}/\n\n`;
for (const s of secoes) {
  indice += `## ${s.titulo}\n\n`;
  for (const p of s.paginas) {
    indice += `- [${p.titulo}](${p.url}): ${p.descricao}\n`;
    completo += `---\n\n# ${p.titulo}\n\nURL: ${p.url}\n\n${p.corpo}\n\n`;
  }
  indice += '\n';
}

await writeFile(path.join(publicDir, 'llms.txt'), indice.trimEnd() + '\n');
await writeFile(path.join(publicDir, 'llms-full.txt'), completo.trimEnd() + '\n');
console.log(`llms.txt e llms-full.txt gerados (${secoes.reduce((n, s) => n + s.paginas.length, 0)} páginas).`);
