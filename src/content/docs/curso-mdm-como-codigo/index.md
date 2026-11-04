---
title: "Série: MDM como Código"
description: "Aprenda a gerenciar o Jamf Pro com código: OpenTofu, plan antes de apply, credenciais separadas e um grupo piloto seguro. Em vídeo, com laboratório passo a passo."
lastUpdated: 2026-10-30
sidebar:
  order: 0
---

Você já mudou uma policy direto no console e não lembrava, semanas depois, quem fez o quê? Esta série troca o clique por código: **o Git vira a fonte da verdade e nada vai para o Jamf sem você ler o plano antes**.

São 4 aulas curtas, cada uma com **vídeo, passo a passo para copiar e um checkpoint** para você saber se deu certo. Tudo roda em uma instância Jamf de **laboratório**.

## Para quem é

Analistas e admins de Apple/MDM que já conhecem o Jamf Pro e querem parar de depender de cliques. Não precisa saber Terraform.

## O que você vai ter no final

- OpenTofu instalado e conectado ao Jamf sem nenhum segredo em arquivo.
- O ciclo seguro `plan` → revisar → `apply` do plano salvo, com credencial de leitura separada da de escrita.
- Um grupo piloto, uma categoria, um script e uma política criados por código, com escopo só no piloto.

## Trilha

| Aula | Tema | Tempo |
|---|---|---|
| [1. Por que MDM como código](/curso-mdm-como-codigo/01-por-que-mdm-como-codigo/) | O problema do console e a ideia do Git como fonte da verdade | ~6 min |
| [2. Preparar o ambiente](/curso-mdm-como-codigo/02-preparar-o-ambiente/) | OpenTofu, API client do Jamf e Keychain | ~12 min |
| [3. Seu primeiro apply seguro](/curso-mdm-como-codigo/03-primeiro-apply-seguro/) | Grupo piloto, categoria e o ciclo `plan` → `apply` | ~14 min |
| [4. Script e política no piloto](/curso-mdm-como-codigo/04-script-e-politica-no-piloto/) | Script como arquivo, política com escopo explícito e limpeza | ~15 min |

## Antes de começar

- Uma instância Jamf Pro **de laboratório**. Não use produção para aprender.
- Permissão para criar API role e API client nela.
- Um Mac com terminal e Homebrew.

:::caution[Todo o conteúdo é genérico e de laboratório]
Os exemplos usam nomes fictícios e o prefixo `[TESTE-IaC]`. Nunca coloque credenciais no código e nunca cole URL de instância ou segredo em ferramentas de IA ou em chats.
:::

## Código e licença

Os exemplos testados estão no repositório **MDM como Código**. O texto é CC BY 4.0: pode compartilhar e adaptar, com crédito a Deívid Santos.

Testado com **OpenTofu 1.12.6** e provider **`deploymenttheory/jamfpro` 0.42.0**, em macOS (Apple Silicon). Providers mudam: confira as versões antes de seguir.
