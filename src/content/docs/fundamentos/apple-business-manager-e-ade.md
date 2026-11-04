---
title: "Apple Business Manager e Automated Device Enrollment (ADE)"
description: "Como o ABM atribui dispositivos ao seu MDM e como o ADE entrega Mac e iPhone prontos para uso, sem encostar na máquina. Inclui checklist de implantação."
lastUpdated: 2026-10-17
sidebar:
  order: 2
---

O Apple Business Manager (ABM) é o portal em que a organização informa à Apple quais dispositivos são dela e qual servidor MDM deve gerenciá-los. O **Automated Device Enrollment (ADE)** é o processo que usa essa informação: quando o dispositivo é ligado pela primeira vez, ele consulta a Apple, descobre que pertence a uma organização e se inscreve no MDM durante o Assistente de Configuração, antes de o usuário chegar à área de trabalho.

> "Zero-Touch Deployment" é o nome popular desse resultado, mas o termo técnico da Apple é ADE. Zero-touch enrollment, por sua vez, é o nome do programa equivalente no Android. Ao pesquisar, use "Automated Device Enrollment".

## O fluxo

1. A organização compra o dispositivo da Apple ou de um revendedor autorizado vinculado ao ABM.
2. O dispositivo aparece no ABM e é atribuído a um servidor MDM.
3. Na primeira inicialização, o dispositivo contata a Apple, recebe a URL de enrollment e instala o perfil MDM.
4. O MDM aplica a configuração definida para aquele grupo de dispositivos, como pular telas do Assistente, criar a conta local e instalar os primeiros apps.

O resultado é um Mac que sai da caixa, vai direto para a mão do colaborador e chega pronto, sem passar pela TI.

## Checklist de implantação

1. **Inscreva a organização no ABM.** A Apple verifica a empresa e pede dados como o número D-U-N-S. Reserve alguns dias para a aprovação.
2. **Crie administradores nominais e uma conta de contingência.** Evite um único dono do portal.
3. **Vincule os revendedores** (ou informe o número do cliente Apple) para que as compras entrem automaticamente no ABM.
4. **Adicione o servidor MDM no ABM.** No fluxo comum, o MDM gera uma chave pública, você a envia ao ABM, baixa o token do servidor e o carrega no MDM. Cada MDM descreve o procedimento exato.
5. **Defina a configuração de enrollment no MDM.** No Jamf Pro isso é o PreStage Enrollment; em outros produtos o nome muda, mas o conteúdo é parecido: telas do Assistente, conta local, supervisão, perfil MDM removível ou não.
6. **Atribua os dispositivos** ao servidor e à configuração de enrollment.
7. **Teste com um dispositivo real**, apagado e ligado do zero. Máquina virtual não substitui esse teste.

## Decisões que valem uma reunião

- **Autenticação no enrollment.** É possível exigir que o colaborador entre com a conta corporativa durante o Assistente. Isso associa o Mac a uma pessoa desde o primeiro minuto, em troca de uma etapa a mais para quem recebe o equipamento.
- **Conta local.** Você pode criar a conta administrativa de gestão e a conta do usuário durante o enrollment. Defina se o usuário será administrador ou padrão antes de abrir o primeiro lote.
- **Perfil MDM removível ou não.** Em dispositivos corporativos supervisionados, o padrão recomendado é impedir a remoção do perfil pelo usuário.
- **Telas do Assistente.** Pular telas reduz atrito, mas alguns itens (como idioma e rede) existem por um motivo. Pule o que você já resolve por perfil.

## Armadilhas comuns

- **Dispositivo comprado fora do canal.** Aparelhos adquiridos no varejo não entram no ABM sozinhos. Para iPhone e iPad, a Apple documenta a adição manual com o Apple Configurator; confirme na documentação o suporte para o seu modelo.
- **Descarte e revenda.** A atribuição ao ABM sobrevive a uma formatação. Antes de vender, devolver ou doar, **libere o dispositivo no ABM**; caso contrário, quem ligar o equipamento será inscrito no MDM da sua empresa.
- **Token vencido.** O token do servidor no ABM expira em um ano. Veja o alerta de calendário em [O que é MDM](/fundamentos/o-que-e-mdm/).
- **Login federado.** O ABM suporta ID Apple Gerenciado com autenticação federada via Entra ID ou Google Workspace. É útil, mas planeje o domínio e a migração com cuidado antes de ativar.

## Para praticar

Escolha um Mac de laboratório, apague-o e ligue-o do zero com a rede liberada. Anote cada tela do Assistente que aparece e compare com a configuração que você definiu. O que aparecer e você não esperava é o que o usuário vai estranhar.

