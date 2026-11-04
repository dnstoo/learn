---
title: "Aula 3: Seu primeiro apply seguro"
description: "Crie um grupo piloto vazio e uma categoria pelo código, com o ciclo plan, plano salvo e apply."
lastUpdated: 2026-10-30
sidebar:
  order: 3
---

<!-- VIDEO: cole aqui o iframe do vídeo da Aula 3 (YouTube não listado) -->

**Tempo:** ~14 min · **Pré-requisito:** [Aula 2](/curso-mdm-como-codigo/02-preparar-o-ambiente/) funcionando

## O que você vai fazer

Criar os dois primeiros recursos pelo código: um **grupo estático de piloto, vazio**, e uma **categoria de teste**. Nenhum deles afeta computadores.

O grupo piloto vira o **escopo de tudo o que vem depois**. Assim nenhuma mudança nasce atingindo a frota inteira: o pior erro afeta zero máquinas.

## 1. Credencial de escrita

Crie um segundo API role com criar, ler, atualizar e apagar só para **Categories** e **Static Computer Groups**, e um API client para ele. Guarde no Keychain com nomes **diferentes**:

```bash
security add-generic-password -a "$USER" -s mdm-iac-lab-jamf-write-client-id -U -w
security add-generic-password -a "$USER" -s mdm-iac-lab-jamf-write-client-secret -U -w
```

Amplie também a credencial de leitura com **Read Static Computer Groups**.

O script usa a credencial de leitura por padrão e a de escrita só com `JAMF_CRED=write`.

:::note[Variante de laboratório]
Dá para usar um só API client para tudo. Você perde a trava da etapa 4, e isso só é aceitável em laboratório.
:::

## 2. O código

Em `piloto.tf`:

```hcl
resource "jamfpro_static_computer_group" "piloto" {
  name = "[TESTE-IaC] Piloto"
}

resource "jamfpro_category" "teste" {
  name     = "[TESTE-IaC] Categoria"
  priority = 9
}
```

O prefixo `[TESTE-IaC]` avisa qualquer pessoa que abrir o Jamf que aquilo veio do laboratório.

## 3. Plan salvo

```bash
../tofu-kc.sh init
../tofu-kc.sh plan -out=plano.tfplan
```

Esperado: `Plan: 2 to add, 0 to change, 0 to destroy.` Se aparecer `destroy` ou `change` em algo que você não esperava, **pare**.

## 4. A trava

Prove que a credencial de leitura **não escreve**:

```bash
../tofu-kc.sh apply plano.tfplan
```

Esperado: erro de permissão e nada criado.

## 5. Apply com a credencial de escrita

```bash
JAMF_CRED=write ../tofu-kc.sh apply plano.tfplan
```

Como você passou o arquivo do plano, o OpenTofu **não pergunta de novo**: aplica exatamente o que foi lido. Esperado: `2 added`.

## 6. Conferir

Rode `../tofu-kc.sh plan`. Esperado: **"No changes"**. O código, o estado e o Jamf estão de acordo.

## 7. Editar vendo o plano

Troque `priority = 9` por `5` **no arquivo da pasta onde você roda o `tofu`**. Se editar o arquivo errado, o plan dirá "No changes". Depois:

```bash
../tofu-kc.sh plan -out=plano.tfplan
JAMF_CRED=write ../tofu-kc.sh apply plano.tfplan
```

O plano deve mostrar `1 to change` (`priority: 9 -> 5`).

## Checkpoint

- [ ] O grupo e a categoria existem no Jamf.
- [ ] O `plan` depois do `apply` diz "No changes".
- [ ] Você sabe explicar por que o `apply` usa o plano salvo.

## Se der erro

| Sintoma | Causa provável |
|---|---|
| Erro de permissão no `apply` com a credencial de escrita | Falta privilégio de Categories ou Static Computer Groups |
| `plan` falha ao ler o grupo depois de criado | Faltou **Read Static Computer Groups** na leitura |
| Nome já existe | Nomes de categoria e grupo são únicos no Jamf |
| `plan` mostra mudança sem você mexer | Alguém alterou no console (drift) |

:::danger
Nunca aplique um plano que você não gerou agora, nem um plano que você não leu.
:::

**Próxima aula:** [Script e política no piloto](/curso-mdm-como-codigo/04-script-e-politica-no-piloto/)
