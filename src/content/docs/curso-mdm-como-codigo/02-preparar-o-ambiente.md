---
title: "Aula 2: Preparar o ambiente"
description: "Instale o OpenTofu, crie uma credencial de leitura no Jamf, guarde-a no Keychain e prove que a autenticação funciona."
lastUpdated: 2026-10-30
sidebar:
  order: 2
---

<!-- VIDEO: cole aqui o iframe do vídeo da Aula 2 (YouTube não listado) -->

**Tempo:** ~12 min · **Pré-requisito:** [Aula 1](/curso-mdm-como-codigo/01-por-que-mdm-como-codigo/) e uma instância Jamf de laboratório

## O que você vai fazer

1. Instalar o OpenTofu.
2. Criar uma credencial **só de leitura** no Jamf.
3. Guardar a credencial no Keychain, sem arquivo e sem histórico.
4. Rodar `init`, `validate`, `plan` e **provar** que a autenticação funciona.

## 1. Instalar o OpenTofu

```bash
brew update
brew install opentofu
tofu -version
```

O OpenTofu é um fork aberto do Terraform. Os comandos são os mesmos, só que o executável se chama `tofu`.

## 2. Credencial de leitura no Jamf

Em **Settings → System → API roles and clients** (confirme o nome do menu na sua versão):

1. Crie um **API role** só com privilégios de leitura, mais **Read Categories** para o teste.
2. Crie um **API client** com esse role. Guarde o **Client ID** e o **Client Secret** (o secret costuma aparecer uma única vez).
3. Defina **Access Token Lifetime** de **3600 segundos**.

:::caution
Com o lifetime curto, o provider falha com `token lifetime is shorter than buffer period`. A mensagem não fala em permissão, então engana.
:::

## 3. Guardar no Keychain

Com `-w` no final o macOS **pede o valor**, em vez de ele aparecer na linha de comando e no histórico:

```bash
security add-generic-password -a "$USER" -s mdm-iac-lab-jamf-url -U -w
security add-generic-password -a "$USER" -s mdm-iac-lab-jamf-client-id -U -w
security add-generic-password -a "$USER" -s mdm-iac-lab-jamf-client-secret -U -w
```

A URL vai **com `https://` e sem barra no final**. O script `tofu-kc.sh` do repositório lê esses três itens e chama o `tofu`.

## 4. Os arquivos e o primeiro plan

Copie `provider.tf` e `variables.tf` da pasta `exemplos/jamf/00-conectar/` para uma pasta de trabalho **fora do repositório**:

```hcl
terraform {
  required_providers {
    jamfpro = {
      source  = "deploymenttheory/jamfpro"
      version = "~> 0.42.0"
    }
  }
}

provider "jamfpro" {
  jamfpro_instance_fqdn = var.jamf_url
  auth_method           = "oauth2"
  client_id             = var.jamf_client_id
  client_secret         = var.jamf_client_secret
}
```

```bash
../tofu-kc.sh init
../tofu-kc.sh validate
../tofu-kc.sh plan
```

O `plan` vai dizer "No changes", mas **isso não prova a autenticação**: sem nenhum recurso na configuração, o provider nem chega a falar com o Jamf.

## 5. Provar que autentica

Crie `verifica.tf` lendo uma categoria que **já exista**:

```hcl
data "jamfpro_category" "teste" {
  name = "NOME-EXATO-DE-UMA-CATEGORIA-EXISTENTE"
}
```

Rode `../tofu-kc.sh plan`. O esperado:

```
data.jamfpro_category.teste: Read complete after 0s [id=...]
No changes. Your infrastructure matches the configuration.
```

Apague o `verifica.tf` depois.

## Checkpoint

- [ ] `tofu -version` mostra a versão.
- [ ] O `plan` com `verifica.tf` termina em segundos com `Read complete`.
- [ ] Nenhum segredo apareceu em arquivo ou no histórico do terminal.

## Se der erro

| Sintoma | Causa provável |
|---|---|
| `401 Unauthorized` em ~10 s | Client ID ou Secret errado. A mensagem é a mesma para os dois |
| `unsupported protocol scheme ""` | URL sem `https://` |
| `Still reading...` por minutos | A categoria não existe. Confira o nome |
| `No category assigned` não funciona | É rótulo da interface, não uma categoria consultável |

**Próxima aula:** [Seu primeiro apply seguro](/curso-mdm-como-codigo/03-primeiro-apply-seguro/)
