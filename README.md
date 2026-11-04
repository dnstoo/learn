# Modern Workplace na prática

Site de tutoriais em português sobre MDM, Jamf Pro, infraestrutura como código e DEX para frotas Apple corporativas. Publicado em https://blog.deividsantos.com.br

Feito com [Astro Starlight](https://starlight.astro.build/) e publicado pelo GitHub Pages.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera a pasta dist/ (também atualiza llms.txt e llms-full.txt)
```

Requer Node 22 ou superior.

## Escrever uma lição nova

1. Crie um arquivo `.md` na pasta da trilha, por exemplo `src/content/docs/jamf-pro/minha-licao.md`.
2. Comece pelo cabeçalho:

   ```md
   ---
   title: "Título claro e específico da lição"
   description: "Uma ou duas frases (até 160 caracteres) dizendo o que a pessoa aprende."
   lastUpdated: 2026-10-17
   sidebar:
     order: 3
   ---
   ```

3. Rode `npm run dev`, confira e faça o push. O deploy acontece sozinho.
4. Atualize a página `roadmap.md` (mova a lição de "Próximas" para "Publicado").

A barra lateral, o sitemap, o `llms.txt` e os dados estruturados (schema.org) são gerados automaticamente a partir do cabeçalho.

## Estrutura

```text
src/content/docs/      lições, uma pasta por trilha
src/styles/custom.css  identidade visual
src/routeData.ts       dados estruturados de cada lição
scripts/gerar-llms.mjs gera llms.txt e llms-full.txt antes do build
scripts/gerar-og.mjs   gera public/og.png (imagem de compartilhamento)
public/                robots.txt, favicon, CNAME, og.png
```

## Publicação

Veja `PUBLICAR.md` na pasta acima: repositórios, DNS no Registro.br e checklist de SEO.
