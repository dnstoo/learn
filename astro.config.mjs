// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { existsSync } from 'node:fs';

// ───────── Ajuste estes valores quando criar o repositório ─────────
const SITE = 'https://blog.deividsantos.com.br';
const SITE_PESSOAL = 'https://deividsantos.com.br';
const GITHUB_USER = 'dnstoo'; // ex.: 'deividsantos'. Vazio = sem link do GitHub e sem "Editar página".
const GITHUB_REPO = 'learn';
// ────────────────────────────────────────────────────────────────

// O curso só entra no menu se a pasta existir neste checkout: slug inexistente no sidebar derruba o build.
const TEM_CURSO = existsSync(new URL('./src/content/docs/curso-mdm-como-codigo/index.md', import.meta.url));

const NOME_SITE = 'Blog Modern Workplace Apple';
const DESCRICAO =
  'Blog em português sobre MDM, Jamf Pro, infraestrutura como código e experiência digital do colaborador (DEX) para frotas Apple em ambientes corporativos.';

const autor = {
  '@type': 'Person',
  '@id': `${SITE_PESSOAL}/#deivid`,
  name: 'Deívid Santos',
  url: SITE_PESSOAL,
  jobTitle: 'Especialista em Modern Workplace e gestão de dispositivos Apple',
  knowsAbout: [
    'Gerenciamento de dispositivos Apple',
    'MDM',
    'Jamf Pro',
    'Apple Business Manager',
    'Microsoft Intune',
    'Platform SSO',
    'Infraestrutura como código',
    'Digital Employee Experience',
    'macOS',
  ],
  ...(GITHUB_USER ? { sameAs: [`https://github.com/${GITHUB_USER}`] } : {}),
};

const jsonLdSite = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Blog',
      '@id': `${SITE}/#site`,
      name: NOME_SITE,
      url: SITE,
      description: DESCRICAO,
      inLanguage: 'pt-BR',
      publisher: { '@id': autor['@id'] },
    },
    autor,
  ],
};

export default defineConfig({
  site: SITE,
  integrations: [
    starlight({
      title: NOME_SITE,
      description: DESCRICAO,
      favicon: '/favicon.png',
      defaultLocale: 'root',
      locales: { root: { label: 'Português', lang: 'pt-BR' } },
      lastUpdated: true,
      routeMiddleware: './src/routeData.ts',
      customCss: ['./src/styles/custom.css'],
      components: { PageTitle: './src/components/PageTitle.astro', Header: './src/components/Header.astro' },
      social: GITHUB_USER
        ? [{ icon: 'github', label: 'GitHub', href: `https://github.com/${GITHUB_USER}/${GITHUB_REPO}` }]
        : [],
      ...(GITHUB_USER
        ? { editLink: { baseUrl: `https://github.com/${GITHUB_USER}/${GITHUB_REPO}/edit/main/` } }
        : {}),
      head: [
        { tag: 'meta', attrs: { name: 'author', content: 'Deívid Santos' } },
        { tag: 'meta', attrs: { property: 'og:locale', content: 'pt_BR' } },
        { tag: 'meta', attrs: { property: 'og:image', content: `${SITE}/og.png` } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: `${SITE}/og.png` } },
        { tag: 'link', attrs: { rel: 'preload', href: '/fonts/bricolage-grotesque-latin-opsz-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: '' } },
        { tag: 'link', attrs: { rel: 'alternate', type: 'text/plain', href: '/llms.txt', title: 'llms.txt' } },
        { tag: 'script', attrs: { type: 'application/ld+json' }, content: JSON.stringify(jsonLdSite) },
      ],
      // Grupos recolhidos (o Starlight abre sozinho o da página atual) e rótulos curtos.
      // Lição nova: acrescente uma linha aqui (os rótulos curtos não vêm do título do arquivo).
      sidebar: [
        {
          label: 'Comece por aqui',
          items: [
            { label: 'Roadmap dos temas', slug: 'roadmap' },
            { label: 'Sobre o autor e o site', slug: 'sobre' },
            { label: 'Site de Deívid Santos', link: SITE_PESSOAL },
          ],
        },
        ...(TEM_CURSO
          ? [
            {
              label: 'Série: MDM como Código',
              collapsed: true,
              items: [
                { label: 'Visão geral', slug: 'curso-mdm-como-codigo' },
                { label: 'Aula 1: Por que MDM como código', slug: 'curso-mdm-como-codigo/01-por-que-mdm-como-codigo' },
                { label: 'Aula 2: Preparar o ambiente', slug: 'curso-mdm-como-codigo/02-preparar-o-ambiente' },
                { label: 'Aula 3: Seu primeiro apply seguro', slug: 'curso-mdm-como-codigo/03-primeiro-apply-seguro' },
                { label: 'Aula 4: Script e política no piloto', slug: 'curso-mdm-como-codigo/04-script-e-politica-no-piloto' },
              ],
            },
            ]
          : []),
        {
          label: 'Fundamentos de MDM e ABM',
          collapsed: true,
          items: [
            { label: 'O que é MDM', slug: 'fundamentos/o-que-e-mdm' },
            { label: 'ABM e ADE', slug: 'fundamentos/apple-business-manager-e-ade' },
            { label: 'Supervisão e enrollment', slug: 'fundamentos/supervisao-e-tipos-de-enrollment' },
          ],
        },
        {
          label: 'Jamf Pro na prática',
          collapsed: true,
          items: [
            { label: 'Smart Groups e EAs', slug: 'jamf-pro/smart-groups-e-extension-attributes' },
            { label: 'Scripts para produção', slug: 'jamf-pro/scripts-para-producao' },
          ],
        },
        {
          label: 'IaC para dispositivos',
          collapsed: true,
          items: [
            { label: 'Por que IaC e por onde começar', slug: 'iac/iac-para-mdm-por-que-e-por-onde-comecar' },
            { label: 'Pipeline com GitHub Actions', slug: 'iac/pipeline-de-validacao-com-github-actions' },
          ],
        },
        {
          label: 'DEX: experiência do colaborador',
          collapsed: true,
          items: [
            { label: 'O que é DEX e como medir', slug: 'dex/o-que-e-dex-e-como-medir' },
            { label: 'Sinais de DEX com EAs', slug: 'dex/sinais-de-dex-com-extension-attributes' },
          ],
        },
        {
          label: 'Modern Workplace',
          collapsed: true,
          items: [
            { label: 'Mapa do Modern Workplace', slug: 'modern-workplace/mapa-do-modern-workplace-apple' },
            { label: 'Platform SSO: visão geral', slug: 'modern-workplace/platform-sso-visao-geral' },
          ],
        },
      ],
    }),
  ],
});
