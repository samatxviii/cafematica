# Preparação para AdSense — 12/10/2026

A aprovação pertence ao Google. Nenhuma quantidade fixa de textos, palavras ou acessos garante aprovação.

## O que foi implementado

- HTML completo gerado no servidor de build e servido publicamente por HTTPS.
- Dez artigos originais com explicações, exemplos ou atividades práticas, distribuídos em três categorias.
- Identificação do Cafemática, apresentação do professor, contato real e política de correções.
- Páginas de privacidade, cookies, termos e moderação.
- Títulos, descrições, canonical, dados estruturados, sitemap e RSS.
- Navegação responsiva, busca e links verificados.
- Vídeos externos somente mediante autorização do leitor.
- Sem anúncios automáticos, tráfego comprado ou estímulo a cliques.
- Comentários com moderação prévia e limitação de frequência, ativados apenas após configuração real.

## Antes da solicitação

1. Revisar os dez textos com o professor e acrescentar exemplos, atividades e experiências próprias ao longo do tempo. A IA é declarada; não há alegação de revisão humana que ainda não aconteceu.
2. Confirmar visualmente em computador e celular, testar os canais de contato e revisar as políticas para refletir a operação real.
3. Conferir no Search Console indexação, propriedade do domínio e sitemap. Não foi realizada uma submissão ao Search Console por esta implementação.
4. Usar o publisher ID da conta real do proprietário. A meta de verificação e `ads.txt` são gerados ao preencher o ID; nenhum ID fictício foi inserido. `ads.txt` é recomendado, não garantia de aprovação.
5. Conectar o site no AdSense e manter o conteúdo acessível ao rastreador. Verificar se a conta já utilizada no YouTube precisa adicionar o produto de anúncios para sites.
6. Antes de veicular publicidade, configurar consentimento aplicável, inclusive CMP certificada pelo Google quando exigida para visitantes das regiões cobertas. O seletor simples de vídeos não substitui uma CMP de publicidade.
7. Não clicar nos próprios anúncios, pedir cliques, disfarçar anúncios de conteúdo ou publicar material sem direitos de uso.

A ferramenta de sorteio antiga continua acessível por seu endereço, sem destaque editorial e com noindex. `noindex` não dispensa o cumprimento das políticas: o proprietário deve avaliar todo o conteúdo do domínio. Páginas de teste e a antiga aplicação Flask não integram o novo pacote de produção.

## Fontes oficiais

- [Elegibilidade do AdSense](https://support.google.com/adsense/answer/9724?hl=pt-BR)
- [Preparar as páginas para o AdSense](https://support.google.com/adsense/answer/7299563?hl=pt-BR)
- [Políticas do programa](https://support.google.com/adsense/answer/48182?hl=pt-BR)
- [Políticas para editores do Google](https://support.google.com/publisherpolicies/answer/10502938?hl=pt-BR)
- [Requisitos de consentimento e CMP](https://support.google.com/adsense/answer/13554116?hl=pt-BR)
- [Guia de ads.txt](https://support.google.com/adsense/answer/7532444?hl=pt-BR)

## Limites da validação realizada

Os testes automatizados cobrem conteúdo, links, consentimento de vídeos e políticas SQL. Não houve validação visual em navegador nesta sessão, pois o recurso de navegador exigido pelo fluxo Sites não estava disponível. OAuth Google, SMTP e publicação pela Edge Function dependem das configurações de conta e devem ser testados após a ativação. Não foi enviada solicitação de aprovação ao AdSense.
