---
title: "O que é MDM e como o macOS e o iOS conversam com ele"
description: "Entenda o protocolo MDM da Apple: enrollment, notificações push (APNs), perfis, comandos e Declarative Device Management, com o fluxo de ponta a ponta."
lastUpdated: 2026-10-17
sidebar:
  order: 1
---

MDM (Mobile Device Management) é o mecanismo nativo da Apple para configurar, proteger e manter dispositivos à distância. Ele já vem dentro do macOS, iOS e iPadOS. O que você compra ou hospeda (Jamf Pro, Intune, Mosyle, Hexnode e outros) é um **servidor MDM**: um sistema que fala esse protocolo com os dispositivos.

Entender o fluxo evita metade dos problemas de suporte, porque quase todo "o comando não chegou" se explica por um dos pontos abaixo.

## Os quatro participantes

| Participante | Papel |
|---|---|
| Dispositivo | Recebe perfis e comandos, executa e devolve o resultado. |
| Servidor MDM | Guarda a configuração desejada, enfileira comandos e responde ao dispositivo. |
| APNs (Apple Push Notification service) | Avisa o dispositivo de que existe algo esperando no servidor. |
| Apple Business Manager (ABM) | Informa à Apple qual servidor MDM deve gerenciar cada dispositivo da organização. |

## O fluxo de ponta a ponta

1. **Enrollment.** O dispositivo recebe um perfil de enrollment com um payload MDM: endereço do servidor, tópico do APNs e a identidade usada na comunicação.
2. **Check-in.** O dispositivo se apresenta ao servidor com mensagens como `Authenticate` e `TokenUpdate` (que entrega o token de push). Quando o dispositivo sai da gestão, envia `CheckOut`.
3. **Comando.** O servidor enfileira um comando e manda um push pelo APNs. O push não carrega o comando: é só um aviso. O dispositivo então conecta ao servidor, busca o próximo comando, executa, devolve o resultado e repete até a fila esvaziar.

Uma consequência prática: o servidor nunca abre conexão direta com o Mac ou o iPhone. O dispositivo precisa conseguir sair para o seu servidor por HTTPS e alcançar o APNs. A Apple documenta as portas e a faixa de rede (17.0.0.0/8) que o firewall corporativo precisa liberar. Confira a lista atual na documentação da Apple antes de abrir o chamado de rede.

## Perfis, comandos e DDM

Existem três formas de o servidor influenciar o dispositivo, e vale saber qual você está usando.

| Mecanismo | Como funciona | Exemplo |
|---|---|---|
| Perfil de configuração (`.mobileconfig`) | Arquivo com payloads que descrevem uma configuração. O dispositivo aplica e mantém. | Wi-Fi, certificados, restrições, FileVault. |
| Comando MDM | Ação pontual enviada pelo servidor. | Instalar um app, bloquear a tela, apagar o dispositivo, consultar informações. |
| Declarative Device Management (DDM) | O servidor envia declarações. O dispositivo as avalia sozinho e avisa o servidor quando o estado muda. | Atualizações de software gerenciadas, configurações e ativações condicionais. |

O DDM reduz a dependência de consulta constante ao dispositivo, porque quem avalia e reage é o próprio sistema. A Apple tem indicado que novos recursos de gerenciamento chegam preferencialmente por esse caminho, então vale acompanhar o que o seu MDM já suporta.

## Certificados que derrubam a frota quando vencem

Três validades merecem alerta no calendário do time, com aviso de 60, 30 e 7 dias:

- **Certificado de push do MDM (APNs).** Vale por um ano. Quando vence, o servidor deixa de acordar os dispositivos. **Renove** o certificado existente no portal de certificados push da Apple, com o mesmo Apple ID. Criar um novo em vez de renovar exige reinscrever os dispositivos.
- **Token do servidor MDM no ABM.** Também tem validade anual e precisa ser renovado.
- **Token de apps e livros (VPP).** Mesmo princípio: validade de um ano.

Use um Apple ID corporativo de função, não pessoal, e documente quem tem acesso a ele. Quando a pessoa que criou o certificado sai da empresa, é esse registro que salva a renovação.

## O que o MDM não faz

- Não vê a tela do usuário nem lê o conteúdo de arquivos pessoais.
- Em enrollment de usuário (cenário BYOD), o alcance é deliberadamente menor. Veja [Supervisão e tipos de enrollment](/fundamentos/supervisao-e-tipos-de-enrollment/).
- Não substitui antivírus ou EDR. Ele configura e mantém; não detecta comportamento malicioso.
- Não executa nada em dispositivo desligado ou sem rede. O comando fica na fila.

## Para praticar

No Mac, rode no Terminal:

```bash
profiles status -type enrollment
```

A saída informa se o Mac foi inscrito via ADE ("Enrolled via DEP"), se está sob MDM e qual é o servidor. Depois abra **Ajustes do Sistema → Geral → Gestão de Dispositivos** e compare os perfis listados com o que você espera encontrar. Repita em um Mac de teste que nunca foi inscrito para ver a diferença.

