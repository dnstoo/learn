---
title: "Aula 4: Script e política no piloto"
description: "Crie um script e uma política por código, com escopo explícito só no grupo piloto, teste em um Mac de laboratório e limpe tudo no final."
lastUpdated: 2026-10-30
sidebar:
  order: 4
---

<!-- VIDEO: cole aqui o iframe do vídeo da Aula 4 (YouTube não listado) -->

**Tempo:** ~15 min · **Pré-requisito:** [Aula 3](/curso-mdm-como-codigo/03-primeiro-apply-seguro/), na mesma pasta e no mesmo estado

## O que você vai fazer

Criar um **script** que ajusta o nome do computador e uma **política** que o executa, com escopo **só no grupo piloto**. Com o grupo vazio, a política existe mas não atinge nenhum Mac.

## Por que script e não blueprint

Não há componente de blueprint para renomear computador. O caminho que funciona é um script shell executado por uma política.

## O script

`scripts/definir_hostname.sh`:

```bash
#!/bin/bash
set -euo pipefail

SERIAL="$(ioreg -l | awk -F'"' '/IOPlatformSerialNumber/ {print $4}')"
[[ -z "$SERIAL" ]] && { echo "Não foi possível ler o número de série." >&2; exit 1; }

NOVO="MAC-${SERIAL}"
ATUAL="$(scutil --get ComputerName 2>/dev/null || true)"
[[ "$ATUAL" == "$NOVO" ]] && { echo "Nome já está correto: ${NOVO}"; exit 0; }

scutil --set ComputerName "$NOVO"
scutil --set HostName "$NOVO"
scutil --set LocalHostName "$NOVO"
echo "Renomeado: '${ATUAL}' -> '${NOVO}'"
```

Duas propriedades importantes:

- **Idempotente:** se o nome já está certo, não faz nada.
- **Falha cedo:** sem número de série, para com erro, em vez de nomear o Mac de `MAC-`.

O padrão `MAC-<serial>` é só exemplo. Use a convenção da sua organização.

## O código

`hostname.tf`:

```hcl
resource "jamfpro_script" "hostname" {
  name            = "[TESTE-IaC] Definir hostname"
  priority        = "AFTER"
  category_id     = jamfpro_category.teste.id
  info            = "Define ComputerName, HostName e LocalHostName como MAC-<serial>. Idempotente."
  script_contents = file("${path.module}/scripts/definir_hostname.sh")
}

resource "jamfpro_policy" "hostname" {
  name          = "[TESTE-IaC] Definir hostname"
  enabled       = true
  frequency     = "Once per computer"
  trigger_other = "iac-hostname"
  category_id   = jamfpro_category.teste.id

  scope {
    all_computers      = false
    computer_group_ids = [jamfpro_static_computer_group.piloto.id]
  }

  payloads {
    scripts {
      id       = jamfpro_script.hostname.id
      priority = "After"
    }

    maintenance {
      recon = true
    }
  }
}
```

Os pontos que importam:

- `file(...)`: o script fica como arquivo de verdade, versionado.
- `all_computers = false` é obrigatório no schema. Escrito explicitamente, ninguém escopa "todos" por esquecimento.
- O grupo é referenciado, então o OpenTofu cria o grupo antes da política.
- `trigger_other` é um gatilho manual: a política só roda quando você chamar.

## Plan e apply

Antes de aplicar, a credencial de escrita precisa de privilégios de **Scripts** e **Policies**.

```bash
../tofu-kc.sh plan -out=plano.tfplan
JAMF_CRED=write ../tofu-kc.sh apply plano.tfplan
../tofu-kc.sh plan
```

Esperado: `2 to add`, depois `2 added`, e por fim "No changes". No Jamf, a política aparece **ativa e sem nenhum computador no escopo**.

:::note
No laboratório, o primeiro `apply` falhou com `403 INVALID_PRIVILEGE` ao criar o script, por falta de **Create Scripts**. O erro leva mais de 1 minuto para aparecer, porque o provider repete a chamada antes de desistir. Não é travamento.
:::

## Testar em um Mac seu (opcional)

:::danger
Este teste **renomeia o Mac**. Faça só em um computador de laboratório seu, inscrito no Jamf.
:::

1. Coloque o Mac no grupo piloto **pelo código**, com `assigned_computer_ids = [ID-DO-SEU-MAC]` no `piloto.tf`. Se adicionar à mão no Jamf, o próximo `plan` pode mostrar a remoção.
2. A frequência é `Once per computer`: renomeie antes para um nome temporário (guarde os originais com `scutil --get`), senão o script vê o nome certo e consome a única execução.
3. Dispare o gatilho:

```bash
sudo jamf policy -event iac-hostname
scutil --get ComputerName
```

## Limpeza

```bash
JAMF_CRED=write ../tofu-kc.sh plan -destroy -out=limpeza.tfplan
JAMF_CRED=write ../tofu-kc.sh apply limpeza.tfplan
```

O plano deve listar **só** os recursos `[TESTE-IaC]`. Se listar mais alguma coisa, **não aplique**.

## Checkpoint

- [ ] A política existe, ativa, com escopo só no piloto.
- [ ] O `plan` seguinte diz "No changes".
- [ ] A limpeza removeu apenas os recursos de teste.

## O que você aprendeu no curso

- O Git como fonte da verdade e o ciclo `plan` → `apply` do plano salvo.
- Credencial de leitura separada da de escrita, no Keychain.
- Escopo explícito e grupo piloto como rede de segurança.
- Script como arquivo, versionado e idempotente.

## Próximos passos

Instalação de app, perfis, blueprints, PreStage, guardrails e o lado Intune. Acompanhe o [roadmap das trilhas](/roadmap/).
