// Gera public/og.png (1200x630), imagem de compartilhamento para redes sociais e buscadores.
// Uso (uma vez, ou quando mudar o texto): node scripts/gerar-og.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const saida = fileURLToPath(new URL('../public/og.png', import.meta.url));

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b1322"/>
  <rect x="72" y="72" width="8" height="486" fill="#4b74ff"/>
  <text x="112" y="150" font-family="sans-serif" font-size="30" fill="#8493a6">blog.deividsantos.com.br</text>
  <text x="112" y="300" font-family="sans-serif" font-size="82" font-weight="700" fill="#f3f6fa">Modern Workplace</text>
  <text x="112" y="396" font-family="sans-serif" font-size="82" font-weight="700" fill="#f3f6fa">para Apple, na prática</text>
  <text x="112" y="480" font-family="sans-serif" font-size="32" fill="#b4c0ce">MDM, Jamf Pro, IaC e DEX em português</text>
  <circle cx="1068" cy="516" r="22" fill="#f2b233"/>
  <text x="112" y="548" font-family="sans-serif" font-size="28" fill="#8493a6">Deívid Santos</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(saida);
console.log('og.png gerado em', saida);
