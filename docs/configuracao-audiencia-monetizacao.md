# Configuração de audiência e monetização do Cafemática

Estado inicial (outubro de 2026): GA4 não configurado; AdSense desligado. Este documento não autoriza ativação automática de publicidade.

## 1. Criar o Google Analytics 4 (GA4)

1. Entre em https://analytics.google.com/ e crie uma conta/propriedade GA4, se necessário.
2. Em **Administrador > Fluxos de dados**, crie/abra um fluxo **Web** para `https://www.cafematica.com.br`.
3. Copie o **ID de medição**, no formato `G-XXXXXXXXXX`.
4. Em `config/site.json`, preencha `googleAnalyticsMeasurementId` com esse ID. Não inclua a tag HTML inteira.
5. **Antes de publicar o ID**, revise `/privacidade/` e `/cookies/` para informar sobre Google Analytics, finalidades, fornecedor, consentimento, revogação e tratamento de dados, conforme a configuração real.
6. Teste localmente com `npm ci && npm run build && npm run verify`; valide o botão **Preferências de privacidade**.
7. Publique a alteração via fluxo normal do repositório. Na primeira visita sem preferência v2, o site solicitará uma escolha: sem consentimento de estatísticas, o GA4 não será carregado.
8. Verifique o relatório **Tempo real** do GA4 numa sessão de teste em que você autorizou as estatísticas. No navegador, confira que não há carregamento de `googletagmanager.com/gtag/js` sem consentimento.

Nota: o sistema preserva a antiga preferência de vídeos sem tratá-la como consentimento para estatísticas. Para publicidade personalizada, será necessário revisar separadamente os requisitos de consentimento/CMP do Google e as normas aplicáveis.

## 2. Verificar Google Search Console

1. Abra https://search.google.com/search-console.
2. Adicione a propriedade de domínio `cafematica.com.br`; o Google normalmente solicitará um registro TXT no DNS do domínio. Esse método abrange subdomínios.
3. **Alternativa:** adicione a propriedade **Prefixo do URL** `https://www.cafematica.com.br/` e escolha a verificação por **tag HTML**; copie apenas o valor `content` da metatag `google-site-verification` para `googleSearchConsoleVerification` em `config/site.json`. Publique e clique em Verificar.
4. Envie `https://www.cafematica.com.br/sitemap-index.xml`, previsto no build Astro, e acompanhe as páginas indexadas, cliques e impressões.

## 3. AdSense somente após aprovação

1. Abra https://www.google.com/adsense/ e adicione `cafematica.com.br` em **Sites**.
2. Conclua a verificação de propriedade e solicite análise do site.
3. Ao receber o código `ca-pub-XXXXXXXXXXXXXXXX`, pode-se preencher `adsensePublisherId` em `config/site.json` para gerar a metatag de identificação e `ads.txt` via `scripts/finish-build.mjs`. A presença desse ID **não ativa anúncios automaticamente**: `adsEnabled` permanece `false`.
4. Só publicar scripts/posições de anúncios depois de a revisão estar **Pronto**, ajustar consentimento/CMP e documentação de privacidade, e confirmar as políticas aplicáveis. `scripts/verify-build.mjs` bloqueia a inclusão antecipada de `pagead2`.

## 4. Revisão técnica antes de mesclar

- [ ] `npm run build` e `npm run verify` passam.
- [ ] Sem ID de GA4, não há chamadas para GA4 nem janela obrigatória de consentimento de Analytics.
- [ ] Com ID válido, o GA4 não carrega antes de consentimento explícito.
- [ ] Com consentimento, aparece ao menos um acesso em GA4 Tempo real.
- [ ] Rejeitar estatísticas impede novas medições, inclusive após recarregar.
- [ ] Controles de vídeos do YouTube continuam funcionando.
- [ ] Textos de privacidade e cookies atualizados **antes** de publicar um ID real.
- [ ] Anúncios não são habilitados sem revisão e consentimento apropriado.

Referências oficiais: https://support.google.com/analytics/answer/9304153, https://support.google.com/webmasters/answer/9008080, https://support.google.com/adsense/answer/12169212.
