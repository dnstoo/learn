---
title: "Aula 1: Por que MDM como código"
description: "O que dá errado quando o MDM vive de cliques no console e como Git, pull request e plan resolvem isso."
lastUpdated: 2026-10-30
sidebar:
  order: 1
---

<!-- VIDEO: cole aqui o iframe do vídeo da Aula 1 (YouTube não listado) -->

**Tempo:** ~6 min · **Pré-requisito:** nenhum

## O que você vai aprender

- Por que mudança direta no console vira problema com o tempo.
- O que muda quando o Git vira a fonte da verdade.
- Qual é o ciclo que vamos seguir no curso inteiro.

## O problema

Alguém cria um perfil, outro ajusta uma policy, um terceiro apaga um grupo "que parecia não usado". Meses depois ninguém sabe quem mudou o quê, o ambiente de testes não se parece com o de produção, e quem entendia o desenho saiu da empresa.

## A ideia

| Hoje, no console | Com código |
|---|---|
| Mudança feita direto em produção | Mudança proposta em pull request, revisada e aprovada |
| Histórico só no log de auditoria | Histórico no Git: quem, quando, por quê |
| Teste e produção divergem em silêncio | Os dois recebem o mesmo código |
| Desfazer exige lembrar o estado anterior | Desfazer é reverter o commit |
| Conhecimento na cabeça de uma pessoa | Conhecimento no repositório |

## O ciclo do curso

```
plan (leitura)  →  revisar  →  plan salvo  →  apply (escrita)  →  plan de novo = "No changes"
```

- O `plan` mostra o que **vai** mudar, sem mudar nada.
- O `apply` só roda sobre o plano que você leu.
- Depois do `apply`, outro `plan` precisa dizer **"No changes"**. Se disser outra coisa, algo está fora do código.

## Checkpoint

Responda sem olhar:

1. Qual é a fonte da verdade quando você usa MDM como código?
2. Por que o `apply` deve usar o plano salvo, e não rodar um `plan` novo?

<details>
<summary>Respostas</summary>

1. O repositório Git, não o console.
2. Para o que for aplicado ser exatamente o que você revisou.
</details>

## Para aprofundar

[Infraestrutura como código para MDM: por que e por onde começar](/iac/iac-para-mdm-por-que-e-por-onde-comecar/)

**Próxima aula:** [Preparar o ambiente](/curso-mdm-como-codigo/02-preparar-o-ambiente/)
