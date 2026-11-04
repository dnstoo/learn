import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

const SITE = 'https://blog.deividsantos.com.br';
const AUTOR_ID = 'https://deividsantos.com.br/#deivid';

// Nome de cada trilha no breadcrumb (o pedaço da URL não tem acento nem maiúsculas).
const NOMES_TRILHA: Record<string, string> = {
  'curso-mdm-como-codigo': 'Curso: MDM como Código',
  fundamentos: 'Fundamentos de MDM e ABM',
  'jamf-pro': 'Jamf Pro na prática',
  iac: 'IaC para dispositivos',
  dex: 'DEX: experiência do colaborador',
  'modern-workplace': 'Modern Workplace',
};

// Injeta dados estruturados (schema.org TechArticle + BreadcrumbList) em cada lição.
export const onRequest = defineRouteMiddleware((context) => {
  const { entry, head } = context.locals.starlightRoute;

  // A home (splash) e páginas sem lição já têm o JSON-LD global do site.
  if (entry.data.template === 'splash') return;

  const url = new URL(context.url.pathname, SITE).href;
  const modificado =
    entry.data.lastUpdated instanceof Date ? entry.data.lastUpdated.toISOString().slice(0, 10) : undefined;

  const partes = context.url.pathname.split('/').filter(Boolean);
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE + '/' },
      ...partes.slice(0, -1).map((parte, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: NOMES_TRILHA[parte] ?? parte.replace(/-/g, ' '),
        item: `${SITE}/${partes.slice(0, i + 1).join('/')}/`,
      })),
      { '@type': 'ListItem', position: partes.length + 1, name: entry.data.title, item: url },
    ],
  };

  const artigo = {
    '@type': 'TechArticle',
    headline: entry.data.title,
    description: entry.data.description,
    inLanguage: 'pt-BR',
    mainEntityOfPage: url,
    author: { '@id': AUTOR_ID },
    ...(modificado ? { dateModified: modificado, datePublished: modificado } : {}),
  };

  head.push({
    tag: 'script',
    attrs: { type: 'application/ld+json' },
    content: JSON.stringify({ '@context': 'https://schema.org', '@graph': [artigo, breadcrumb] }),
  });
});
